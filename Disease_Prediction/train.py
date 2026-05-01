import kagglehub
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

IMG_SIZE = 224
BATCH_SIZE = 32
SEED = 42

dataset_path = kagglehub.dataset_download("shubham2703/five-crop-diseases-dataset")
print("Path to dataset files:", dataset_path)

data_dir = os.path.join(dataset_path, "Crop Diseases Dataset", "Crop Diseases", "Crop___Disease")
print("Data directory path:", data_dir)

train_ds = tf.keras.utils.image_dataset_from_directory(
    data_dir,
    labels='inferred',
    label_mode='categorical',
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    validation_split=0.2,
    subset='training',
    seed=SEED
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    data_dir,
    labels='inferred',
    label_mode='categorical',
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    validation_split=0.2,
    subset='validation',
    seed=SEED
)

class_labels = train_ds.class_names
num_classes = len(class_labels)
print(f"Number of classes: {num_classes}")
print(f"Class labels: {class_labels}")

def rescale(image, label):
    image = tf.cast(image, tf.float32)
    return image / 255.0, label

train_ds = train_ds.map(rescale)
val_ds = val_ds.map(rescale)

data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal_and_vertical"),
    tf.keras.layers.RandomRotation(0.2),
    tf.keras.layers.RandomZoom(0.2),
    tf.keras.layers.RandomTranslation(0.1, 0.1),
    tf.keras.layers.RandomContrast(0.2),
])

def apply_augmentation(image, label):
    return data_augmentation(image, training=True), label

train_ds = train_ds.map(apply_augmentation, num_parallel_calls=tf.data.AUTOTUNE)
train_ds = train_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

base = ResNet50(include_top=False, weights='imagenet', input_shape=(IMG_SIZE, IMG_SIZE, 3))
base.trainable = False

x = GlobalAveragePooling2D()(base.output)
x = Dropout(0.3)(x)
out = Dense(num_classes, activation='softmax')(x)
model = Model(base.input, out)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

callbacks = [
    EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True),
    ModelCheckpoint('best_plant_disease_model.h5', save_best_only=True)
]

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=15,
    callbacks=callbacks
)

base.trainable = True
model.compile(optimizer=tf.keras.optimizers.Adam(1e-4), loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=5,
    callbacks=callbacks
)

model.save('plant_disease_cnn_final.h5')
print("Final model saved as 'plant_disease_cnn_final.h5'")
print("Best model saved as 'best_plant_disease_model.h5'")
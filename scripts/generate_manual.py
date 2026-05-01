import os
from fpdf import FPDF
import datetime

class MyAgriiManual(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.set_text_color(46, 125, 50) 
        self.cell(80)
        self.cell(30, 10, 'MyAgrii User Manual', 0, 0, 'C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

    def chapter_title(self, title):
        self.ln(5)
        self.set_font('Arial', 'B', 14)
        self.set_fill_color(232, 245, 233)
        self.set_text_color(46, 125, 50)
        self.cell(0, 10, f" {title}", 0, 1, 'L', True)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 11)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 8, body)
        self.ln()

    def add_image_slide(self, image_path, caption):
        if os.path.exists(image_path):
            self.ln(5)
            w = 140
            h = 140
            x = (210 - w) / 2
            self.image(image_path, x=x, w=w)
            self.ln(2)
            self.set_font('Arial', 'I', 9)
            self.set_text_color(100, 100, 100)
            self.cell(0, 10, caption, 0, 1, 'C')
            self.ln(5)

def create_manual(output_path, dashboard_img, disease_img):
    pdf = MyAgriiManual()
    pdf.alias_nb_pages()
    
    pdf.add_page()
    pdf.set_font('Arial', 'B', 32)
    pdf.set_text_color(46, 125, 50)
    pdf.ln(40)
    pdf.cell(0, 20, 'MyAgrii', 0, 1, 'C')
    pdf.set_font('Arial', 'I', 18)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, 'Your Digital Agriculture Partner', 0, 1, 'C')
    pdf.ln(20)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Generated on: {datetime.datetime.now().strftime("%B %d, %Y")}', 0, 1, 'C')
    
    pdf.add_page()
    pdf.chapter_title('1. Introduction')
    pdf.chapter_body(
        "Welcome to MyAgrii, the state-of-the-art digital agriculture platform designed to empower farmers and "
        "agronomists with AI-driven insights. Our platform bridges the gap between traditional farming and "
        "modern science, providing tools for soil analysis, crop selection, and disease prevention."
    )
    
    pdf.chapter_title('2. Dashboard Overview')
    pdf.chapter_body(
        "The MyAgrii dashboard is your central hub for all agricultural activities. From here, you can quickly "
        "access prediction modules, view your history, and manage your field data at a glance."
    )
    pdf.add_image_slide(dashboard_img, "Figure 1: MyAgrii Premium Dashboard Concept")

    pdf.add_page()
    pdf.chapter_title('3. Getting Started')
    pdf.chapter_body(
        "* Registration: Sign up using your name, email, and a secure password.\n"
        "* Login Security: MyAgrii features a secure 3-device session limit to protect your data.\n"
        "* Profile Management: Update your location and agronomist title in the Profile section to "
        "localize your prediction results."
    )

    pdf.chapter_title('4. Core AI Modules')
    
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '4.1 Soil Suitability Analysis', 0, 1)
    pdf.chapter_body(
        "Input environmental parameters such as Temperature, Humidity, Precipitation, and Wind Speed "
        "to determine if your soil is favorable for cultivation. The system provides a suitability score "
        "and detailed scientific analysis."
    )

    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '4.2 Crop Recommendation', 0, 1)
    pdf.chapter_body(
        "By analyzing nitrogen (N), phosphorus (P), potassium (K), pH levels, and rainfall, MyAgrii "
        "recommends the top 3 crops most likely to thrive in your specific soil conditions."
    )

    pdf.add_page()
    pdf.chapter_title('5. Crop Disease Detection')
    pdf.chapter_body(
        "Protect your yield using our neural-pipeline-powered disease detection. Simply upload or capture "
        "a photo of a crop leaf. Our AI identifies pathogens across Corn, Potato, Rice, Wheat, and Sugarcane "
        "with high precision."
    )
    pdf.add_image_slide(disease_img, "Figure 2: Real-time Pathogen Scanning with MyAgrii AI")

    pdf.chapter_title('6. Utility Features')
    
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '6.1 Smart AI Chatbot', 0, 1)
    pdf.chapter_body(
        "Integrated with Gemini 1.5 Flash, our chatbot provides real-time answers to your agricultural "
        "questions, offering advice on pest control, irrigation, and best practices."
    )

    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '6.2 Data Export & Reports', 0, 1)
    pdf.chapter_body(
        "Need to share your findings? Use the Export Data feature in your Profile to receive a "
        "professional PDF report of your complete prediction history via email."
    )

    pdf.output(output_path)
    print(f"Manual successfully generated at: {output_path}")

if __name__ == "__main__":
    DASHBOARD_IMG = "/Users/yaphetesayas/.gemini/antigravity/brain/e926a7e6-ce1f-4e6f-862a-426520344636/myagrii_dashboard_mockup_1775187234167.png"
    DISEASE_IMG = "/Users/yaphetesayas/.gemini/antigravity/brain/e926a7e6-ce1f-4e6f-862a-426520344636/myagrii_disease_scan_mockup_1775187289766.png"
    OUTPUT = "/Users/yaphetesayas/Desktop/MyAgrii/MyAgrii_User_Manual.pdf"
    
    create_manual(OUTPUT, DASHBOARD_IMG, DISEASE_IMG)

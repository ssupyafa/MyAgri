import os
import re

def remove_python_comments(text):
    return re.sub(r'(?m)^[ \t]*#.*(?:\r?\n|$)', '', text)

def remove_c_style_comments(text):
    pattern = re.compile(
        r'//.*?$|/\*.*?\*/|\'(?:\\\\|\\\'|[^\'])*\'|"(?:\\\\|\\"|[^"])*"',
        re.DOTALL | re.MULTILINE
    )
    def replacer(match):
        s = match.group(0)
        if s.startswith('/'):
            return ""
        else:
            return s
    return pattern.sub(replacer, text)

def remove_html_comments(text):
    return re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

def process_file(file_path):
    print(f"Processing: {file_path}")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.py':
        new_content = remove_python_comments(content)
        new_content = re.sub(r'(\s)#.*', r'\1', new_content)
    elif ext in ['.js', '.jsx', '.ts', '.tsx', '.dart', '.css']:
        new_content = remove_c_style_comments(content)
    elif ext in ['.html', '.htm']:
        new_content = remove_html_comments(content)
    else:
        return

    new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    project_root = "/Users/yaphetesayas/Desktop/MyAgrii"
    exclude_dirs = {'.git', '.venv', '__pycache__', 'node_modules', 'dist', 'build', '.dart_tool'}
    
    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.py', '.js', '.jsx', '.ts', '.tsx', '.dart', '.css', '.html', '.htm']:
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()

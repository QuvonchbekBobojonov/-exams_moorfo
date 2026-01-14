import os
import codecs

def fix_encoding(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'rb') as f:
                        content = f.read()
                    
                    # Check for BOMs or just try to decode as utf-16
                    is_utf16 = False
                    if b'\xff\xfe' in content[:2] or b'\xfe\xff' in content[:2]:
                        is_utf16 = True
                    else:
                        # Try to detect by checking for a lot of null bytes
                        if b'\x00' in content:
                            is_utf16 = True
                    
                    if is_utf16:
                        print(f"Fixing {filepath}")
                        # Try both utf-16-le and utf-16-be
                        try:
                            text = content.decode('utf-16')
                        except:
                            text = content.decode('utf-16-le')
                        
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(text)
                except Exception as e:
                    print(f"Error fixing {filepath}: {e}")

if __name__ == "__main__":
    fix_encoding(r"c:\Users\moorf\PycharmProjects\-exams_moorfo\frontend\src")

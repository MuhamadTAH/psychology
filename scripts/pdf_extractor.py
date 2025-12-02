import sys, json, fitz, io, base64, os
from PIL import Image
import pytesseract

# ✅ Set Tesseract path manually (change if installed somewhere else)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    result = { "text": [], "images": [] }

    for page_num in range(len(doc)):
        page = doc[page_num]

        # --- TEXT EXTRACTION ---
        text = page.get_text("text")

        if not text.strip():  # If no text found → fallback to OCR
            print(f"Debug: Page {page_num+1} has no text, using OCR...", file=sys.stderr)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # higher resolution for OCR
            img_data = pix.tobytes("png")
            image = Image.open(io.BytesIO(img_data))
            text = pytesseract.image_to_string(image, lang="eng")

        if text.strip():
            result["text"].append({
                "page": page_num + 1,
                "content": text.strip()
            })

        # --- IMAGE EXTRACTION ---
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]

            # Convert to base64
            image = Image.open(io.BytesIO(image_bytes))
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()

            result["images"].append({
                "page": page_num + 1,
                "image": img_str
            })

    doc.close()
    return result


def main():
    if len(sys.argv) != 2:
        print(json.dumps({"status": "error", "error": "Usage: python pdf_extractor.py <pdf_path>"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    try:
        print(f"Debug: processing {pdf_path}", file=sys.stderr)
        result = extract_pdf(pdf_path)
        print(f"Debug: extracted {len(result['text'])} text blocks and {len(result['images'])} images", file=sys.stderr)
        print(json.dumps({"status": "success", **result}))
    except Exception as e:
        print(json.dumps({"status": "error", "error": str(e)}))


if __name__ == "__main__":
    main()

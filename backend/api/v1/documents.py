import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from services.synthetic_document_generator import SyntheticDocumentGenerator, STATIC_DOCS_DIR
from services.ocr_worker import OCRWorker

router = APIRouter(prefix="/documents", tags=["Document AI & OCR"])

@router.get("/demo-list")
def list_demo_documents():
    """Lists available pre-generated synthetic government certificates for testing."""
    SyntheticDocumentGenerator.ensure_output_dir()
    files = []
    if os.path.exists(STATIC_DOCS_DIR):
        for f in os.listdir(STATIC_DOCS_DIR):
            if f.endswith((".svg", ".html", ".pdf", ".png")):
                files.append({
                    "filename": f,
                    "download_url": f"/api/v1/documents/download/{f}",
                    "document_type": "ST_CERTIFICATE" if "st_" in f else ("INCOME_CERTIFICATE" if "income" in f else "ADMISSION_LETTER"),
                    "is_flawed_demo": "flawed" in f
                })
    return {"count": len(files), "documents": files}

@router.post("/generate-all")
def generate_all_demo_documents():
    """Generates all 4 synthetic certificates in backend/static/demo_documents/."""
    paths = SyntheticDocumentGenerator.generate_all_demo_documents()
    return {"status": "SUCCESS", "generated_documents": paths}

@router.get("/download/{filename}")
def download_demo_document(filename: str):
    path = os.path.join(STATIC_DOCS_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Document file not found")
    media_type = "image/svg+xml" if filename.endswith(".svg") else "application/octet-stream"
    return FileResponse(path, media_type=media_type, filename=filename)

@router.post("/analyze-ocr")
async def analyze_document_ocr(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    applicant_name: str = Form("Rahul Kumar")
):
    """
    Runs the Document AI & OCR pipeline:
    - Extracts structured entities
    - Calculates confidence scores
    - Generates bounding box coordinates for UI rendering
    """
    content = await file.read()
    result = OCRWorker.process_document(
        content=content,
        filename=file.filename,
        doc_type=document_type,
        applicant_name=applicant_name
    )
    return result

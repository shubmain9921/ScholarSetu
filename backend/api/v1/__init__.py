from fastapi import APIRouter
from api.v1.auth import router as auth_router
from api.v1.schemes import router as schemes_router
from api.v1.applications import router as apps_router
from api.v1.officer import router as officer_router
from api.v1.admin import router as admin_router
from api.v1.documents import router as documents_router
from api.v1.committee import router as committee_router
from api.v1.grievances import router as grievances_router
from api.v1.assistant import router as assistant_router

api_v1_router = APIRouter()
api_v1_router.include_router(auth_router)
api_v1_router.include_router(schemes_router)
api_v1_router.include_router(apps_router)
api_v1_router.include_router(officer_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(committee_router)
api_v1_router.include_router(grievances_router)
api_v1_router.include_router(assistant_router)

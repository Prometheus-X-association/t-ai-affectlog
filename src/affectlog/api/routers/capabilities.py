"""Capability registry endpoints — returns full typed catalog of all supported capabilities."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from affectlog.capabilities.formats import UNSUPPORTED_FORMATS
from affectlog.capabilities.registry import (
    get_all_analyses,
    get_all_exports,
    get_all_formats,
    get_all_model_adapters,
    get_all_plots,
    get_capability_json,
)

router = APIRouter(prefix="/v1/capabilities", tags=["Capabilities"])


@router.get("", summary="Full capability catalog")
async def get_full_capabilities() -> dict[str, Any]:
    return get_capability_json()


@router.get("/formats", summary="Supported input formats")
async def get_formats() -> dict[str, Any]:
    return {
        "supported": [f.model_dump() for f in get_all_formats()],
        "unsupported": [f.model_dump() for f in UNSUPPORTED_FORMATS],
    }


@router.get("/analyses", summary="Supported analyses")
async def get_analyses() -> dict[str, Any]:
    return {"analyses": [a.model_dump() for a in get_all_analyses()]}


@router.get("/plots", summary="Supported plots")
async def get_plots() -> dict[str, Any]:
    return {"plots": [p.model_dump() for p in get_all_plots()]}


@router.get("/exports", summary="Supported export artifacts")
async def get_exports() -> dict[str, Any]:
    return {"exports": [e.model_dump() for e in get_all_exports()]}


@router.get("/model-adapters", summary="Supported model adapters")
async def get_model_adapters() -> dict[str, Any]:
    return {"model_adapters": [m.model_dump() for m in get_all_model_adapters()]}

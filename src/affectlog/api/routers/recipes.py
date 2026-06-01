"""Recipes endpoints: list available YAML pipeline recipes."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import APIRouter

router = APIRouter(prefix="/v1/recipes", tags=["Recipes"])

_RECIPES_DIR = Path("configs/recipes")


@router.get("", summary="List available pipeline recipes")
async def list_recipes() -> dict[str, Any]:
    recipes: list[dict[str, str]] = []
    if _RECIPES_DIR.exists():
        for f in sorted(_RECIPES_DIR.glob("*.yaml")):
            recipes.append({"name": f.stem, "path": str(f), "filename": f.name})
    return {"recipes": recipes}

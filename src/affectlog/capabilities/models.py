"""Model adapter capability definitions."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class ModelTaskType(StrEnum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    RANKING = "ranking"
    UNKNOWN = "unknown"


class ModelAdapterDefinition(BaseModel):
    id: str
    label: str
    description: str
    format_ids: list[str]
    supported_tasks: list[ModelTaskType]
    supports_probability: bool = False
    supports_feature_importance: bool = False
    supports_local_explanation: bool = False
    supports_partial_dependence: bool = False
    notes: str = ""
    unsupported_for: list[str] = Field(default_factory=list)


MODEL_ADAPTERS: list[ModelAdapterDefinition] = [
    ModelAdapterDefinition(
        id="sklearn_adapter",
        label="scikit-learn Adapter",
        description="Supports any scikit-learn estimator serialised with joblib or pickle. Enables full SHAP-based explanation pipeline.",
        format_ids=["model_artifact_sklearn"],
        supported_tasks=[ModelTaskType.CLASSIFICATION, ModelTaskType.REGRESSION],
        supports_probability=True,
        supports_feature_importance=True,
        supports_local_explanation=True,
        supports_partial_dependence=True,
    ),
    ModelAdapterDefinition(
        id="onnx_adapter",
        label="ONNX Adapter",
        description="Supports ONNX models for classification and regression. Feature importance via permutation (SHAP not available for all ONNX architectures).",
        format_ids=["model_artifact_onnx"],
        supported_tasks=[ModelTaskType.CLASSIFICATION, ModelTaskType.REGRESSION],
        supports_probability=True,
        supports_feature_importance=True,
        supports_local_explanation=False,
        supports_partial_dependence=False,
        notes="Local SHAP explanations not supported for all ONNX model types.",
    ),
    ModelAdapterDefinition(
        id="torch_adapter",
        label="PyTorch Adapter",
        description="Supports PyTorch tabular models (state dict or TorchScript). Feature importance via gradient-based attribution.",
        format_ids=["model_artifact_torch"],
        supported_tasks=[ModelTaskType.CLASSIFICATION, ModelTaskType.REGRESSION],
        supports_probability=True,
        supports_feature_importance=True,
        supports_local_explanation=True,
        supports_partial_dependence=False,
        notes="Partial dependence not supported. Requires tabular input — not for raw image/text models.",
    ),
    ModelAdapterDefinition(
        id="tensorflow_adapter",
        label="TensorFlow / Keras Adapter",
        description="Supports TensorFlow SavedModel and Keras .h5 tabular models.",
        format_ids=["model_artifact_tensorflow"],
        supported_tasks=[ModelTaskType.CLASSIFICATION, ModelTaskType.REGRESSION],
        supports_probability=True,
        supports_feature_importance=True,
        supports_local_explanation=False,
        supports_partial_dependence=False,
    ),
    ModelAdapterDefinition(
        id="http_adapter",
        label="HTTP Model Endpoint Adapter",
        description="Wraps a remote prediction endpoint conforming to the AffectLog model adapter interface. Feature importance disabled by default unless the endpoint exposes it.",
        format_ids=["http_model_endpoint"],
        supported_tasks=[
            ModelTaskType.CLASSIFICATION,
            ModelTaskType.REGRESSION,
            ModelTaskType.RANKING,
        ],
        supports_probability=False,
        supports_feature_importance=False,
        supports_local_explanation=False,
        supports_partial_dependence=False,
        notes="Explanation analyses require the endpoint to expose a /explain or /shap route.",
    ),
    ModelAdapterDefinition(
        id="dummy_adapter",
        label="Dummy / Mock Adapter",
        description="For testing and development. Returns deterministic mock predictions based on input shape.",
        format_ids=["model_artifact_sklearn"],
        supported_tasks=[ModelTaskType.CLASSIFICATION, ModelTaskType.REGRESSION],
        supports_probability=True,
        supports_feature_importance=True,
        supports_local_explanation=True,
        supports_partial_dependence=True,
        notes="Development and testing only. Not for production assessments.",
    ),
]

MODEL_ADAPTER_BY_ID: dict[str, ModelAdapterDefinition] = {m.id: m for m in MODEL_ADAPTERS}
MODEL_ADAPTER_IDS: set[str] = {m.id for m in MODEL_ADAPTERS}

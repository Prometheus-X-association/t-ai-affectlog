"""Supported and unsupported input format definitions."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class FormatCategory(StrEnum):
    EDUCATIONAL_TRACE = "educational_trace"
    TABULAR = "tabular"
    MODEL_ARTIFACT = "model_artifact"
    MODEL_ENDPOINT = "model_endpoint"
    PREDICTION = "prediction"
    GROUND_TRUTH = "ground_truth"


class SupportedFormat(BaseModel):
    id: str
    label: str
    category: FormatCategory
    description: str
    file_extensions: list[str]
    max_rows_recommended: int | None = None
    requires_schema_confirmation: bool = False
    xapi_compatible: bool = False
    schema_fields: list[str] = Field(default_factory=list)
    notes: str = ""


class UnsupportedFormat(BaseModel):
    id: str
    label: str
    description: str
    user_message: str
    extension_path: str = ""


SUPPORTED_FORMATS: list[SupportedFormat] = [
    SupportedFormat(
        id="maskott_csv_v1",
        label="Maskott / Tactileo Activity CSV",
        category=FormatCategory.EDUCATIONAL_TRACE,
        description="Structured CSV export from the Maskott/Tactileo educational platform containing user-resource interaction records.",
        file_extensions=[".csv"],
        max_rows_recommended=5_000_000,
        requires_schema_confirmation=False,
        xapi_compatible=True,
        schema_fields=[
            "_id",
            "AccessDate",
            "ViewContext",
            "ResourceId",
            "ResourceType",
            "CollectionId",
            "ActivitySessionId",
            "Duration",
            "EntityId",
            "EntityUaiCode",
            "IsViewerAuthor",
            "IsViewerAnonymous",
        ],
        notes="Pre-mapped schema. AffectLog auto-detects and pre-fills all field mappings.",
    ),
    SupportedFormat(
        id="becomino_json",
        label="Becomino JSON Activity Export",
        category=FormatCategory.EDUCATIONAL_TRACE,
        description="JSON export from the Becomino platform with templated activity-object structures.",
        file_extensions=[".json"],
        xapi_compatible=True,
        requires_schema_confirmation=True,
        schema_fields=["actor", "verb", "object", "timestamp", "context"],
    ),
    SupportedFormat(
        id="generic_xapi_json",
        label="Generic xAPI JSON",
        category=FormatCategory.EDUCATIONAL_TRACE,
        description="Standard xAPI statement array in JSON format conforming to the ADL xAPI specification.",
        file_extensions=[".json"],
        xapi_compatible=True,
        requires_schema_confirmation=True,
        schema_fields=["actor", "verb", "object", "result", "context", "timestamp"],
    ),
    SupportedFormat(
        id="generic_xapi_jsonl",
        label="Generic xAPI JSONL",
        category=FormatCategory.EDUCATIONAL_TRACE,
        description="xAPI statements in newline-delimited JSON (one statement per line). Efficient for large datasets.",
        file_extensions=[".jsonl", ".ndjson"],
        xapi_compatible=True,
        max_rows_recommended=10_000_000,
        requires_schema_confirmation=True,
        schema_fields=["actor", "verb", "object", "result", "context", "timestamp"],
    ),
    SupportedFormat(
        id="generic_csv_tabular",
        label="Generic Tabular CSV",
        category=FormatCategory.TABULAR,
        description="Structured CSV with header row. Requires manual field mapping for entity, item, timestamp, and target fields.",
        file_extensions=[".csv", ".tsv"],
        max_rows_recommended=5_000_000,
        requires_schema_confirmation=True,
    ),
    SupportedFormat(
        id="parquet_tabular",
        label="Parquet Tabular Dataset",
        category=FormatCategory.TABULAR,
        description="Apache Parquet columnar format. Efficient for large datasets with typed schemas.",
        file_extensions=[".parquet", ".pq"],
        max_rows_recommended=50_000_000,
        requires_schema_confirmation=True,
    ),
    SupportedFormat(
        id="model_artifact_sklearn",
        label="scikit-learn Model Artifact",
        category=FormatCategory.MODEL_ARTIFACT,
        description="Pickled scikit-learn estimator (joblib or pickle format).",
        file_extensions=[".pkl", ".joblib"],
    ),
    SupportedFormat(
        id="model_artifact_onnx",
        label="ONNX Model Artifact",
        category=FormatCategory.MODEL_ARTIFACT,
        description="Open Neural Network Exchange format. Compatible with classification and regression models.",
        file_extensions=[".onnx"],
    ),
    SupportedFormat(
        id="model_artifact_torch",
        label="PyTorch Model Artifact",
        category=FormatCategory.MODEL_ARTIFACT,
        description="PyTorch model state dict or TorchScript export.",
        file_extensions=[".pt", ".pth"],
    ),
    SupportedFormat(
        id="model_artifact_tensorflow",
        label="TensorFlow / Keras Model",
        category=FormatCategory.MODEL_ARTIFACT,
        description="TensorFlow SavedModel or Keras .h5 format.",
        file_extensions=[".h5", ".keras", ".pb"],
    ),
    SupportedFormat(
        id="http_model_endpoint",
        label="HTTP Model Endpoint",
        category=FormatCategory.MODEL_ENDPOINT,
        description="Remote prediction endpoint conforming to the AffectLog model adapter interface.",
        file_extensions=[],
        notes="Registered by URL. Requires feature matrix to enable explanation analyses.",
    ),
    SupportedFormat(
        id="prediction_csv",
        label="Prediction Output CSV",
        category=FormatCategory.PREDICTION,
        description="CSV containing model prediction outputs. Must include a prediction column and optionally probability columns.",
        file_extensions=[".csv"],
        requires_schema_confirmation=True,
    ),
    SupportedFormat(
        id="ground_truth_csv",
        label="Ground Truth CSV",
        category=FormatCategory.GROUND_TRUTH,
        description="CSV containing verified labels or interaction data for evaluation.",
        file_extensions=[".csv"],
        requires_schema_confirmation=True,
    ),
]

UNSUPPORTED_FORMATS: list[UnsupportedFormat] = [
    UnsupportedFormat(
        id="raw_image_dataset",
        label="Raw Image Dataset",
        description="Directory or archive of image files (JPEG, PNG, TIFF, etc.).",
        user_message=(
            "This input is outside the current AffectLog analysis scope. "
            "AffectLog currently supports structured/tabular datasets, xAPI-style educational traces, "
            "pre-trained tabular ML models, and compatible prediction outputs. "
            "Convert this input into a structured representation (e.g., extracted features in CSV/Parquet) "
            "or implement a compatible adapter/recipe."
        ),
        extension_path="Implement a feature extraction pipeline that converts image embeddings to a tabular feature matrix, then register the result as a generic_csv_tabular or parquet_tabular input.",
    ),
    UnsupportedFormat(
        id="raw_audio_dataset",
        label="Raw Audio Dataset",
        description="Raw audio files (MP3, WAV, FLAC, etc.).",
        user_message=(
            "Raw audio datasets are outside the current AffectLog analysis scope. "
            "Provide vectorized/tabular audio features or implement a compatible adapter."
        ),
        extension_path="Extract audio features (MFCCs, spectral features) as a tabular matrix and register as generic_csv_tabular.",
    ),
    UnsupportedFormat(
        id="raw_video_dataset",
        label="Raw Video Dataset",
        description="Raw video files (MP4, AVI, MOV, etc.).",
        user_message=(
            "Raw video datasets are outside the current AffectLog analysis scope. "
            "Provide frame-level or segment-level tabular features or implement a compatible adapter."
        ),
        extension_path="Extract frame features as tabular data and register as generic_csv_tabular or parquet_tabular.",
    ),
    UnsupportedFormat(
        id="unstructured_text_corpus",
        label="Unstructured Free-Text Corpus",
        description="Raw text documents (TXT, PDF, DOCX, HTML, etc.) without a tabular/vectorized wrapper.",
        user_message=(
            "Unstructured text corpora are outside the current AffectLog analysis scope. "
            "Convert text to a structured representation (e.g., document-feature matrix, embedding CSV) "
            "or implement a compatible NLP adapter."
        ),
        extension_path="Produce a document-level feature matrix (TF-IDF, embeddings) and register as tabular CSV.",
    ),
    UnsupportedFormat(
        id="arbitrary_nlp_model",
        label="Arbitrary NLP Model",
        description="Transformer, LSTM, or other NLP model without a tabular/vectorized adapter wrapper.",
        user_message=(
            "NLP models without a tabular/vectorized wrapper are outside the current AffectLog model adapter scope. "
            "Provide a compatible prediction CSV or implement an HTTP adapter that returns tabular predictions."
        ),
        extension_path="Register an HTTP model endpoint that accepts structured feature inputs and returns tabular prediction outputs.",
    ),
    UnsupportedFormat(
        id="computer_vision_model",
        label="Computer Vision Model",
        description="Image classification, detection, or segmentation model without a compatible adapter.",
        user_message=(
            "Computer vision models without a compatible adapter are outside the current AffectLog scope. "
            "Provide vectorized predictions or implement a compatible adapter."
        ),
        extension_path="Register an HTTP model endpoint or implement a cv_to_tabular adapter recipe.",
    ),
    UnsupportedFormat(
        id="time_series_forecasting_model",
        label="Time-Series Forecasting Model",
        description="Forecasting model (ARIMA, Prophet, LSTM) without tabular feature/prediction compatibility.",
        user_message=(
            "Time-series forecasting models are outside scope unless represented as tabular features "
            "and compatible prediction outputs. Provide a prediction CSV with numeric targets and predictions."
        ),
        extension_path="Export forecasting outputs as a tabular prediction CSV and register as prediction_csv.",
    ),
    UnsupportedFormat(
        id="streaming_production_monitor",
        label="Streaming Production Monitoring",
        description="Live stream or continuous monitoring feed without a batch snapshot connector.",
        user_message=(
            "Streaming production monitoring is not yet supported. "
            "Export a batch snapshot of the monitoring data and register as a tabular or xAPI input."
        ),
        extension_path="Configure a future streaming connector (roadmap item) or export periodic snapshots for batch analysis.",
    ),
]

SUPPORTED_FORMAT_IDS: set[str] = {f.id for f in SUPPORTED_FORMATS}
UNSUPPORTED_FORMAT_IDS: set[str] = {f.id for f in UNSUPPORTED_FORMATS}

FORMAT_BY_ID: dict[str, SupportedFormat] = {f.id: f for f in SUPPORTED_FORMATS}

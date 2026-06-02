# Plot Catalog

All plots produced by AffectLog and their requirements.

## Schema & Quality

| Plot ID | Label | Required Analysis | Privacy |
|---|---|---|---|
| `schema_overview_table` | Schema Overview Table | schema_validation, type_profile | Public |
| `missingness_matrix` | Missingness Matrix | missingness_profile | Public |
| `completeness_bar` | Completeness Bar | completeness_profile | Public |
| `type_distribution_bar` | Field Type Distribution | type_profile | Public |
| `entropy_bar` | Entropy Bar | entropy_profile | Public |
| `pii_field_heatmap` | PII Field Heatmap | pii_scan | Restricted |

## xAPI / Educational Traces

| Plot ID | Label | Required Analysis | Privacy |
|---|---|---|---|
| `verb_distribution_bar` | Verb Distribution | verb_distribution | Public |
| `event_frequency_timeline` | Event Frequency Timeline | temporal_density_profile | Public |
| `temporal_density_histogram` | Temporal Density Histogram | temporal_density_profile | Public |
| `session_density_histogram` | Session Density Histogram | session_density_profile | Public |
| `resource_type_bar` | Resource Type Distribution | resource_type_distribution | Public |
| `top_resources_bar` | Top Resources | resource_dominance | Public |
| `top_entities_bar_pseudonymised` | Top Entities (Pseudonymised) | entity_dominance | Pseudonymised |

## Concentration

| Plot ID | Label | Required Analysis | Privacy |
|---|---|---|---|
| `long_tail_curve` | Long-Tail Curve | long_tail_profile | Public |
| `lorenz_curve` | Lorenz Curve | gini_concentration | Public |
| `gini_summary_card` | Gini Summary Card | gini_concentration | Public |
| `coverage_at_k_curve` | Coverage@K Curve | coverage_at_k | Public |
| `sparsity_heatmap_sample` | Sparsity Heatmap (Sample) | sparsity_analysis | Pseudonymised |
| `cooccurrence_network` | Co-occurrence Network | cooccurrence_summary | Public |
| `representation_index_bar` | Representation Index | representation_index | Public |

## Fairness

| Plot ID | Label | Required | Privacy |
|---|---|---|---|
| `group_distribution_bar` | Group Distribution | group_field | Restricted |
| `fairness_metric_table` | Fairness Metric Table | fairness_by_group + group_field + predictions | Restricted |

## Classification

| Plot ID | Label | Requires Probabilities | Privacy |
|---|---|---|---|
| `confusion_matrix` | Confusion Matrix | No | Public |
| `roc_curve` | ROC Curve | Yes | Public |
| `pr_curve` | Precision-Recall Curve | Yes | Public |
| `calibration_curve` | Calibration Curve | Yes | Public |

## Regression

| Plot ID | Label | Privacy |
|---|---|---|
| `residual_plot` | Residual Plot | Public |
| `prediction_error_histogram` | Prediction Error Histogram | Public |

## Model Explanations

| Plot ID | Label | Requires Model | Privacy |
|---|---|---|---|
| `feature_importance_bar` | Feature Importance | Yes | Public |
| `local_explanation_waterfall` | Local Explanation Waterfall | Yes | Pseudonymised |
| `partial_dependence_plot` | Partial Dependence | Yes | Public |
| `model_comparison_radar` | Model Comparison Radar | Yes (×2) | Public |

## Compliance

| Plot ID | Label | Privacy |
|---|---|---|
| `jsonld_graph_preview` | JSON-LD Graph Preview | Public |
| `audit_pipeline_timeline` | Audit Pipeline Timeline | Public |
| `artifact_stack_view` | Artifact Stack View | Public |

## Privacy Levels

- **Public** — safe to share with any stakeholder
- **Pseudonymised** — entity IDs are HMAC-hashed; safe for aggregate reporting
- **Restricted** — requires privacy acknowledgement; contains sensitive attribute information

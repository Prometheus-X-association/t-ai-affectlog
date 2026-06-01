"""Representation index for strata/groups."""

from __future__ import annotations


def representation_index(group_counts: dict[str, int]) -> dict[str, float]:
    """RI = count_group / mean_count. RI > 1 = overrepresented, < 1 = underrepresented."""
    if not group_counts:
        return {}
    mean = sum(group_counts.values()) / len(group_counts)
    if mean == 0:
        return dict.fromkeys(group_counts, 0.0)
    return {g: round(c / mean, 4) for g, c in group_counts.items()}

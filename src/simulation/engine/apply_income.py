from simulation.models.inputs import IncomeLoad, SettingsInput
from simulation.models.state import SimulationState


def apply_income(state: SimulationState, load: IncomeLoad, setting: SettingsInput):
    if state.date < load.start_date or state.date > load.end_date:
        return state
    
    years_elapsed = state.date - load.start_date
    gross_this_month = load.monthly_gross * load.annual_growth_rate(years_elapsed)

    state.cash += load.curre
    return state

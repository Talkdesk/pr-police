export enum Weekday {
  MONDAY = 'mon',
  TUESDAY = 'tue',
  WEDNESDAY = 'wed',
  THURSDAY = 'thu',
  FRIDAY = 'fri',
  SATURDAY = 'sat',
  SUNDAY = 'sun',
}

export class ScheduleConfiguration {
  constructor(readonly hour: number, readonly minute: number, readonly weekdays: Weekday[]) {}

  public toCron(): string {
    const daysOfWeek = this.weekdays.length > 0 ? this.weekdays.join(',') : '*'

    return `0 ${this.minute} ${this.hour} ? * ${daysOfWeek} *`
  }
}

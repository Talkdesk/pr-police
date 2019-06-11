import { ScheduleConfiguration, Weekday } from '../src/scheduleConfiguration'

describe('Schedule configuration', () => {
  describe('#toCron', () => {
    it('return the equivalent cron expression', () => {
      const schedule = new ScheduleConfiguration(10, 30, [Weekday.MONDAY])

      const scheduleCron = schedule.toCron()

      expect(scheduleCron).toEqual('0 30 10 ? * mon *')
    })
  })

  describe('when there are no weekdays defined', () => {
    it('return the equivalent cron expression', () => {
      const schedule = new ScheduleConfiguration(10, 30, [])

      const scheduleCron = schedule.toCron()

      expect(scheduleCron).toEqual('0 30 10 ? * * *')
    })
  })

  describe('when there are multiple weekdays', () => {
    it('return the equivalent cron expression', () => {
      const schedule = new ScheduleConfiguration(10, 30, [
        Weekday.MONDAY,
        Weekday.WEDNESDAY,
        Weekday.FRIDAY,
      ])

      const scheduleCron = schedule.toCron()

      expect(scheduleCron).toEqual('0 30 10 ? * mon,wed,fri *')
    })
  })
})

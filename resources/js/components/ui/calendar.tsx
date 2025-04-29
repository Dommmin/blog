import * as React from "react"
import { DayPicker } from "react-day-picker"

function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={className}
      {...props}
    />
  )
}

export { Calendar }

import { Day, Event } from '../types/AppTypes'
import { IsDayBetweenTwoDays } from '../utils/time_utils'
interface EventProps {
    day: Day,
    events?: Event[]
}
function AppEvent({ events, day }: EventProps) {

    return (
        <div className='w-full'>
            {events?.map((event) => {
                if (IsDayBetweenTwoDays(event.day_start, event.day_end, day.day_full_date)) {
                    return (
                        <div>
                            <h1>hole</h1>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <p>
                                no evebt
                            </p>
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default AppEvent

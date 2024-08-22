import { useContext } from 'react';

import { TimeTable } from '@components/TimeTable';
import { Typography } from '@components/common/Typography';
import { setHours } from 'date-fns';
import styled from 'styled-components';
import { vars } from 'token';

import { CalendarContext } from './Calendar.provider';
import { TaskData } from './Calendar.types';
import {
  formatTimeIntl,
  generateTimeSlots,
  getGridRowStart,
  getRowSpan,
  getSchedulesForTimeSlot,
} from './Calendar.utils';

/**
 * 시간대별로 일정을 보여주는 컴포넌트
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  width: 100%;
`;

const TimeContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
`;

const TimeTableLabel = styled.div`
  display: grid;
  grid-template-columns: 33px 2fr;
  column-gap: 10px;
  width: 100%;
`;

const GraphItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 158px;
  padding: 9px;
  gap: 8px;
  overflow-y: auto;
`;

const GraphContainer = styled.div`
  display: grid;
  grid-template-columns: 33px 2fr;
  column-gap: 16px;
  align-items: center;
`;

const TimeTableItem = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: repeat(78, 1fr);
  padding: 6px 2.5px;
  border-top: 1px solid ${vars.sementic.color.black10};
  gap: 12px;
  grid-auto-flow: row;
`;

const TimeTableContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(78, 1fr);
  gap: 12px;
`;

const dummySchedules: TaskData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  title: `일정 ${i}`,
  description: '일정 설명',
  // startDate, endDate 모두 다르게 설정
  startDate: setHours(new Date(), i + 1),
  endDate: setHours(new Date(), i + 2),
  status: i % 3,
}));

export const CalendarDay = () => {
  const { value } = useContext(CalendarContext);
  const returnStatus = (status: number) => {
    switch (status) {
      case 0:
        return 'task';
      case 1:
        return 'sub';
      case 2:
        return 'quest';
      default:
        return 'task';
    }
  };

  const schedulesTimeLine = getSchedulesForTimeSlot(dummySchedules, value);

  return (
    <Container>
      <GraphContainer>
        <Typography color="black35" variant="small-text">
          종일
        </Typography>
        <GraphItemsContainer>
          {schedulesTimeLine.map((schedule) => (
            <TimeTable
              key={schedule.id}
              variant="graph"
              status={returnStatus(schedule.status)}
              startTime={formatTimeIntl(schedule.startDate)}
              endTime={formatTimeIntl(schedule.endDate)}
              description={schedule.description}
              rowSpan={getRowSpan(schedule.startDate, schedule.endDate)}
              gridRowStart={getGridRowStart(schedule.startDate)}
              projectId={schedule.id}
              parentTaskId={schedule.id}
              images={'https://picsum.photos/200/300'}
              title={schedule.title}
            />
          ))}
        </GraphItemsContainer>
      </GraphContainer>
      <TimeContainer>
        <TimeTableContainer>
          {generateTimeSlots().map((timeSlot) => (
            <TimeTableLabel key={timeSlot}>
              {/* 1시간 단위로 라벨을 09:00 형식으로 표시 */}
              {
                <Typography color="black35" variant="small-text">
                  {timeSlot.endsWith('00') ? timeSlot : ''}
                </Typography>
              }
            </TimeTableLabel>
          ))}
        </TimeTableContainer>

        <TimeTableItem>
          {schedulesTimeLine.map((schedule, i: number) => {
            const rowStart = getGridRowStart(schedule.startDate);
            console.log(schedule.startDate, rowStart);

            if (rowStart > 78 || rowStart < 0) return null;
            return (
              <TimeTable
                key={`${schedule.id}-${i}`}
                variant="timeTableMedium"
                status={returnStatus(schedule.status)}
                startTime={formatTimeIntl(schedule.startDate)}
                endTime={formatTimeIntl(schedule.endDate)}
                description={schedule.description}
                rowSpan={getRowSpan(schedule.startDate, schedule.endDate)}
                gridRowStart={getGridRowStart(schedule.startDate)}
                projectId={schedule.id}
                parentTaskId={schedule.id}
                images={'https://picsum.photos/200/300'}
                title={schedule.title}
              />
            );
          })}
        </TimeTableItem>
      </TimeContainer>
    </Container>
  );
};

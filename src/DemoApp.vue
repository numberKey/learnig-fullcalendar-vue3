<script lang="ts">
import { defineComponent } from "vue";
import {
  CalendarOptions,
  EventApi,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";

import ViewSelector from "./parts/ViewSelector.vue";

export default defineComponent({
  components: {
    FullCalendar,
    ViewSelector,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        headerToolbar: {
          left: "prev today next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        initialView: "timeGridWeek",
        initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        fixedWeekCount: false,
        // 追加部分
        datesSet: this.handleDatesChange,
        // 追加部分終了
      } as CalendarOptions,
      currentEvents: [] as EventApi[],
      // 追加部分開始
      title: null,
      arg: null,
      currentDate: new Date(),
      // 追加部分終了
    };
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // update a property
    },
    handleDateSelect(selectInfo: DateSelectArg) {
      let title = prompt("Please enter a new title for your event");
      let calendarApi = selectInfo.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
      }
    },
    handleEventClick(clickInfo: EventClickArg) {
      if (
        confirm(
          `Are you sure you want to delete the event '${clickInfo.event.title}'`
        )
      ) {
        clickInfo.event.remove();
      }
    },
    handleEvents(events: EventApi[]) {
      this.currentEvents = events;
    },
    // 追加部分開始
    changeViewMode(viewMode: string) {
      this.$refs.fullCalendar.getApi().changeView(viewMode);
    },
    clickToday() {
      this.$refs.fullCalendar.getApi().today();
    },
    clickPrev() {
      this.$refs.fullCalendar.getApi().prev();
    },
    clickNext() {
      this.$refs.fullCalendar.getApi().next();
    },
    handleDatesChange(arg) {
      // カレンダーの表示範囲が変更されたときの処理
      this.title = arg.view.title;
      this.arg = arg;
      this.currentDate = this.$refs.fullCalendar.getApi().getDate();
    },
    handleChangeSelectDate() {
      // 日付選択が変更されたときの処理
      this.$refs.fullCalendar.getApi().gotoDate(this.currentDate);
    },
    // 追加部分終了
  },
});
</script>

<template>
  <el-container>
    <!-- 追加部分開始 -->
    <el-header>
      <el-row justify="center">
        <el-col :span="3">
          <el-button @click="clickPrev">前</el-button>
          <el-button @click="clickToday">今日</el-button>
          <el-button @click="clickNext">次</el-button>
        </el-col>
        <el-col :span="3">
          <h2>{{ title }}</h2>
        </el-col>
        <el-col :span="3">
          <ViewSelector @change-view-mode="changeViewMode" />
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside>
        <el-row>
          <el-date-picker
            type="date"
            placeholder="Pick a day"
            v-model="currentDate"
            @change="handleChangeSelectDate"
          />
        </el-row>
        <el-row>
          {{ arg }}
        </el-row>
      </el-aside>
      <!-- 追加部分終了 -->
      <el-main>
        <div class="demo-app">
          <div class="demo-app-main">
            <!-- ref="fullCalendar" を追加 -->
            <FullCalendar ref="fullCalendar" :options="calendarOptions" />
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="css">
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  height: 100px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  width: 1200px;
  margin: 0 auto;
}

.el-container {
  height: 100vh;
}

.el-header {
  height: 60px;
  background-color: bisque;
}

.el-aside {
  width: 400px;
  background-color: #d3dce6;
  height: calc(100vh - 60px);
}

.el-main {
  height: calc(100vh - 60px);
}
</style>

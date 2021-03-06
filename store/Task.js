import {createAchieveTask, createStepUpTask} from '../models/Task'
import client from '../util/http-client'
import moment from 'moment'

const TYPE_ACHIEVE = "ACHIEVE"
const TYPE_AMOUNT = "AMOUNT"
const TYPE_TIME = "TIME"

export default {
    namespaced: true,
    state: {
        creationDialog: false,
        stepUpDialog: false,
        achieveDialog: false,
        selectedTask: null,
        list: [],
        date: moment(),
    },
    mutations: {
        openCreationDialog(state) {
            state.creationDialog = true
        },
        closeCreationDialog(state) {
            state.creationDialog = false
        },
        openStepUpDialog(state, taskKey) {
            state.selectedTask = state.list[taskKey]
            state.stepUpDialog = true
        },
        closeStepUpDialog(state) {
            state.selectedTask = null
            state.stepUpDialog = false
        },
        openAchieveDialog(state, taskKey) {
            state.selectedTask = state.list[taskKey]
            state.achieveDialog = true
        },
        closeAchieveDialog(state) {
            state.selectedTask = null
            state.achieveDialog = false
        },
        setList(state, list) {
            state.list = list
        },
        setDate(state, date) {
            state.date = moment(date)
        }
    },
    actions: {
        async create({ state, dispatch }, task) {
            const TASK_TYPE = new Map([[0, TYPE_ACHIEVE], [1, TYPE_AMOUNT], [2, TYPE_TIME]])
            const formData = new FormData()
            formData.append('title', task.title)
            formData.append('dueDate', task.dueDate)
            formData.append('amount', task.amount)
            formData.append('type', TASK_TYPE.get(task.type))
            await client.post('/tasks', formData)
            dispatch('fetchList', state.date)
        },
        async fetchList({ commit }, date) {
            let response = await client.get('/tasks', {
                params: {
                    year: date.year(),
                    month: date.month() + 1,
                    day: date.date()
                }
            })
            const tasks = response.data.map(task => {
                if (task.type === TYPE_AMOUNT) {
                    return createStepUpTask(task.id, task.title, task.dueDate, task.amount, task.progress)
                } else if (task.type === TYPE_ACHIEVE) {
                    return createAchieveTask(task.id, task.title, task.dueDate, task.achieved)
                } else {
                    console.log("不正なタスクです")
                }
            })
            commit('setList', tasks)
        },
        async fetchNowDateTime({ state, commit }) {
            const date = await client.get('/context/time').data
            commit('setDate', moment(date))
        },
        fetchNextDateTasks({ state, commit, dispatch }) {
            const date = state.date.add(1, 'days')
            commit('setDate', date)
            dispatch('fetchList', date)
        },
        fetchPrevDateTasks({ state, commit, dispatch }) {
            const date = state.date.add(-1, 'days')
            commit('setDate', date)
            dispatch('fetchList', date)
        },
        async progress({ state, commit, dispatch }, count) {
            const id = state.selectedTask.id
            commit('closeStepUpDialog')
            await client.patch(`/tasks/${id}/progress/${count}`)
            dispatch('fetchList', state.date)
        },
        async achieve({ state, commit, dispatch }) {
            const id = state.selectedTask.id
            commit('closeAchieveDialog')
            await client.put(`/tasks/${id}/achieved`)
            dispatch('fetchList', state.date)
        },
        openTaskDialog({state, commit}, taskKey) {
            const task = state.list[taskKey]
            if (task.isStepUp()) {
                commit('openStepUpDialog', taskKey)
            } else if (task.isTime()) {
                console.log("未実装のタスクです")
            } else if (task.isAchieve() && ! task.isAchieved()) {
                commit('openAchieveDialog', taskKey)
            }
        },
        async remove({ state, dispatch }, id) {
            await client.delete(`/tasks/${id}`)
            dispatch('fetchList', state.date)
        }
    },
    getters: {
        dateFormatted: state => {
            return state.date.locale('ja').format('MM月DD日（ddd）')
        }
    }
}
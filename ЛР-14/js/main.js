var app = new Vue ({
    el: '.all-content',
    
    data() {
        return {
            card_info: {
                task_id: 1,
                task_name: "",
                worker: "",
                date_start: "",
                date_end: "",
                status: "",
                time_wasted: ""
            },
            all_cards: [],
            elem: "elem",
            nextId: 1,
            newTaskName: "",
            isShowIWM: true,
            curWorker: "",
            isDarkModeOn: false,
            task_name_r: "",
            worker_r: "",
            date_start_r: "",
            date_end_r: "",
            status_r: "",
            saved_task_id: "",
            isShowTR: false
        }
    },

    computed: {
        tasksInPlan: function() {
            return filters.inPlan(this.all_cards)
        },
        tasksInWork: function() {
            return filters.inWork(this.all_cards)
        },
        tasksReady: function() {
            return filters.ready(this.all_cards)
        }
    },

    methods: {
        addTask() {
            if(this.newTaskName != "") {
                this.all_cards.push({
                    task_id: this.nextId,
                    task_name: this.newTaskName,
                    worker: this.curWorker,
                    date_start: "",
                    date_end: "",
                    status: "inPlan",
                    time_wasted: ""
                }),
                this.nextId++,
                this.newTaskName=""
            }
        },

        changeStatus(card_info) {
            if(card_info.status == "inPlan") {
                card_info.date_start = new Date().toLocaleString()
                card_info.status = "inWork"
            }
            else if(card_info.status == "inWork") {
                card_info.date_end = new Date().toLocaleString()
                var end_date = card_info.date_end.trim().split(/\.|,|:/)
                var start_date = card_info.date_start.trim().split(/\.|,|:/)
                var end_date_d = new Date(end_date[2], end_date[1]-1, end_date[0], end_date[3], end_date[4], end_date[5])
                var start_date_d = new Date(start_date[2], start_date[1]-1, start_date[0], start_date[3], start_date[4], start_date[5])
                var millis = end_date_d - start_date_d
                var sec = (millis / 1000) % 60
                var min = (millis / (1000*60)) % 60
                var hours = (millis / (1000*60*60)) % 24
                var days = millis / (1000*60*60*24)
                card_info.time_wasted = "Дней: " + Math.trunc(days) + " Часов: " + Math.trunc(hours) + " Минут: " + Math.trunc(min) + " Секунд: " + Math.trunc(sec)
                card_info.status = "ready"
            }
            else {
                this.all_cards.splice(card_info.task_id-1,1)
            }
        },

        startDrag: (evt, card_info) => {
            evt.dataTransfer.dropEffect = "move"
            evt.dataTransfer.effectAllowed = "move"
            evt.dataTransfer.setData("card_info", card_info.task_id)
        },

        closeWorkerModal() {
            if(this.curWorker != "") {
                this.isShowIWM = false
            }
        },

        onDrop (evt, num) {
            const itemID = evt.dataTransfer.getData("card_info")
            const card_info = this.all_cards.find(card_info => card_info.task_id == itemID)
            if(num == 1) {
                card_info.status = "inPlan"
            }
            else if(num == 2) {
                card_info.date_start = new Date().toLocaleString()
                card_info.status = "inWork"
            }
            else {
                if(card_info.date_start == "") {
                    card_info.date_start = new Date().toLocaleString()
                }
                card_info.date_end = new Date().toLocaleString()
                var end_date = card_info.date_end.trim().split(/\.|,|:/)
                var start_date = card_info.date_start.trim().split(/\.|,|:/)
                var end_date_d = new Date(end_date[2], end_date[1]-1, end_date[0], end_date[3], end_date[4], end_date[5])
                var start_date_d = new Date(start_date[2], start_date[1]-1, start_date[0], start_date[3], start_date[4], start_date[5])
                var millis = end_date_d - start_date_d
                var sec = (millis / 1000) % 60
                var min = (millis / (1000*60)) % 60
                var hours = (millis / (1000*60*60)) % 24
                var days = millis / (1000*60*60*24)
                if(millis < 0) {
                    sec = 0
                    min = 0
                    hours = 0
                    days = 0
                }
                card_info.time_wasted = "Дней: " + Math.trunc(days) + " Часов: " + Math.trunc(hours) + " Минут: " + Math.trunc(min) + " Секунд: " + Math.trunc(sec)
                card_info.status = "ready"
            }
        },

        openTaskRedactor(card_info) {
            this.saved_task_id = card_info.task_id
            this.task_name_r = card_info.task_name
            this.worker_r = card_info.worker
            this.date_start_r = card_info.date_start
            this.status_r = card_info.status
            this.date_end_r = card_info.date_end
            this.isShowTR=true
        },

        nullify() {
            this.task_name_r = ""
            this.worker_r = ""
            this.date_start_r = ""
            this.status_r = ""
            this.date_end_r = ""
        },

        redactTask() {
            const card_info = this.all_cards.find(card_info => card_info.task_id == this.saved_task_id)
            if(this.status_r == "ready") {
                if(card_info.status == "inPlan") {
                    this.date_start_r = new Date().toLocaleString()
                    this.date_end_r = new Date().toLocaleString()
                    this.worker_r = this.curWorker
                }
                if(card_info.status == "inWork") {
                    this.date_end_r = new Date().toLocaleString()
                }
                if(this.task_name_r != "" && this.date_end_r != "" && this.date_start_r != "" && this.worker_r != "") {
                    var end_date = this.date_end_r.trim().split(/\.|,|:/)
                    var start_date = this.date_start_r.trim().split(/\.|,|:/)
                    var end_date_d = new Date(end_date[2], end_date[1]-1, end_date[0], end_date[3], end_date[4], end_date[5])
                    var start_date_d = new Date(start_date[2], start_date[1]-1, start_date[0], start_date[3], start_date[4], start_date[5])
                    if(!isNaN(end_date_d) && !isNaN(start_date_d) && end_date_d >= start_date_d) {
                        card_info.status = this.status_r
                        card_info.date_start = this.date_start_r
                        card_info.date_end = this.date_end_r
                        card_info.worker = this.worker_r
                        card_info.task_name = this.task_name_r
                        var millis = end_date_d - start_date_d
                        var sec = (millis / 1000) % 60
                        var min = (millis / (1000*60)) % 60
                        var hours = (millis / (1000*60*60)) % 24
                        var days = millis / (1000*60*60*24)
                        card_info.time_wasted = "Дней: " + Math.trunc(days) + " Часов: " + Math.trunc(hours) + " Минут: " + Math.trunc(min) + " Секунд: " + Math.trunc(sec)
                        this.nullify()
                        this.isShowTR = false
                    }
                }
            }
            else if(this.status_r == "inWork") {
                if(card_info.status == "inPlan") {
                    this.date_start_r = new Date().toLocaleString()
                    this.worker_r = this.curWorker
                }
                if(this.task_name_r != "" && this.date_start_r != "" && this.worker_r != "") {
                    var start_date = this.date_start_r.trim().split(/\.|,|:/)
                    var start_date_d = new Date(start_date[2], start_date[1]-1, start_date[0], start_date[3], start_date[4], start_date[5])
                    if(!isNaN(start_date_d)) {
                        card_info.status = this.status_r
                        card_info.date_start = this.date_start_r
                        card_info.worker = this.worker_r
                        card_info.task_name = this.task_name_r
                        this.nullify()
                        this.isShowTR = false
                    }
                }
            }
            else if(this.status_r == "inPlan") {
                if(this.task_name_r != "") {
                    card_info.status = this.status_r
                    card_info.task_name = this.task_name_r
                    this.nullify()
                    this.isShowTR = false
                }
            }
        }
    },

    var: filters = {
        inPlan: function (all_cards) {
            return all_cards.filter(function (card_info) {
                return card_info.status === "inPlan"
            });
        },
        inWork: function (all_cards) {
            return all_cards.filter(function (card_info) {
                return card_info.status === "inWork"
            });
        },
        ready: function (all_cards) {
            return all_cards.filter(function (card_info) {
                return card_info.status === "ready"
            });
        }
    }
});
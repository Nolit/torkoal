<template>
    <v-dialog v-model="isOpen" max-width="500px" persistent>
        <v-card>
          <v-card-title primary-title>
              <h3>
                タスク作成
              </h3>
          </v-card-title>
          <v-card-text>
            <v-flex>
              <v-form v-model="formValid">
                <v-text-field
                  label="タイトル"
                  v-model="form.title"
                  :rules="titleRules"
                ></v-text-field>
                <v-menu
                  ref="dueDateDialog"
                  :close-on-content-click="false"
                  v-model="dueDateDialog"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template #activator="activator">
                    <v-text-field
                      v-on="activator.on"
                      v-model="dueDateFormatted"
                      label="実施日"
                      persistent-hint
                      prepend-icon="event"
                      :rules="dueDateRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.dueDate" no-title @input="dueDateDialog = false"></v-date-picker>
                </v-menu>
                <br/>
                <v-tabs fixed-tabs v-model="form.type">
                  <v-tab ripple>
                    Achieve
                  </v-tab>
                  <v-tab ripple>
                    StepUp
                  </v-tab>
                  <v-tab ripple :centered="true">
                    Timer
                  </v-tab>
                  <v-tab-item :transition="false">
                    達成したかどうかのみを記録します
                  </v-tab-item>
                  <v-tab-item :transition="false">
                    目標到達までの数字を記録します
                    <v-text-field
                      label="目標数"
                      type="number"
                      v-model.number="form.amount"
                    ></v-text-field>
                  </v-tab-item>
                  <v-tab-item :transition="false">
                    時間型のタスクは未実装です
                  </v-tab-item>
                </v-tabs>
              </v-form>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="close()">キャンセル</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="create(form);close()" :disabled="!formValid" right>作成</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapMutations, mapState, mapActions  } from 'vuex'

export default {
    data: function () {
        return {
            form: null,
            dueDateDialog: false,
            formValid: true,
            titleRules: [
              v => !!v || 'タイトルを入力してください',
            ],
            dueDateRules: [
              v => !!v || '実施日を入力してください',
            ],
        }
    },
    created: function () {
        this.initializeForm()
    },
    methods: {
        initializeForm: function () {
            this.form = {
                title: '',
                amount: 0,
                dueDate: null,
                type: null
            }
        },
        ...mapMutations('task', {
            close: 'closeCreationDialog',
        }),
        ...mapActions ('task', [
            'create'
        ])
    },
    computed: {
        dueDateFormatted: function () {
            if (!this.form.dueDate) return ''
            const [year, month, day] = this.form.dueDate.split('-')
            return `${year}年${month}月${day}日`
        },
        ...mapState('task', {
            isOpen: 'creationDialog'
        }),
        isStepUp () {
          return this.form.type === 1
        }
    },
    watch: {
      isOpen(isOpen) {
          if (isOpen) {
              this.initializeForm()
          }
      }
    }
}

</script>
<template>
    <v-footer height="auto">
        <v-bottom-navigation
            v-model="navigation"
            :color="'#333333'"
            :value="true"
            dark
            fixed
        >
            <v-btn @click="$router.push('/tasks')" dark>
                <span>Task</span>
                <v-icon>list</v-icon>
            </v-btn>

            <v-btn @click="$router.push('/timelines')" dark>
                <span>Timeline</span>
                <v-icon>timelines</v-icon>
            </v-btn>

            <v-btn @click="$router.push('/friends')" dark>
                <span>Friend</span>
                <v-icon>group</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-footer>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters   } from 'vuex'
export default {
    created() {
        const route = this.$router.currentRoute.name
        if (route === 'tasks') {
           this.navigation = 0
        }
        if (route === 'timelines') {
           this.navigation = 1
        }
        if (route === 'friends') {
           this.navigation = 2
        }
    },
    data () {
        return {
            navigation: null
        }
    }
}
</script>
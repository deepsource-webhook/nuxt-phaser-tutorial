<template>
<div v-if="createGame">
  <phaser-game :create-game="createGame" />
  <hr />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PhaserGame from './PhaserGame.vue'
import Phaser from 'phaser'
const getGame = async (config = {}) => {
    const { default: createGame } = await import('../game/game')
    return createGame
}
declare interface IndexPageData {
    createGame?: () => Phaser.Game
}
const setPhaserFocus = () => {
    const phaser = document.getElementById('phaser')
    if (phaser) phaser.focus()
}
export default Vue.extend({
    name: 'IndexPage',
    components: { PhaserGame },
    data(): IndexPageData {
        return {
            createGame: undefined,
        }
    },
    async mounted() {
        this.createGame = await getGame()
        this.$nextTick(() => setPhaserFocus())
    },
})
</script>

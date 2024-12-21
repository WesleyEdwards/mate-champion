import _ from "lodash"
import {champConst, ChampBase} from "./champ"
import {Entity} from "../Entity"
import {emptyTime, updateTimers} from "../../state/timeHelpers"
import {getChampSpritesInfo} from "./spriteInfo"
import {ChampAction, processActionMap} from "./actions"
import {WithVelType} from "../VelocityMixin"

export function StepChamp<TBase extends WithVelType<ChampBase>>(Base: TBase) {
  return class extends Base {
    step: Entity["step"] = (deltaT) => {
      updateTimers(this.state.timers, deltaT)
      this.move(deltaT)
      if (this.state.gravityFactor) {
        this.state.gravityFactor *= champConst.jumpGravityFrameDecrease
      }
      if (this.velocity[1] > 0 || !this.state.jump.isJumping) {
        this.state.gravityFactor = null
      }
      if (
        this.state.timers.coyote.val > champConst.maxCoyoteTime ||
        this.velocity[1] < 0
      ) {
        const jumpFactor = this.state.gravityFactor
          ? (1 - this.state.gravityFactor) * champConst.gravity
          : champConst.gravity

        this.velocity[1] = this.velocity[1] + jumpFactor * deltaT
      }

      if (this.state.timers.actionTimeRemain.val <= 0) {
        this.state.action = null
      }

      if (this.position.curr[1] > 1000) {
        this.dead = emptyTime("down", 0)
      }

      this.handleChampActions()
      this.updateChampSpriteInfo()
    }

    updateChampSpriteInfo() {
      const currRender = getChampSpritesInfo(this)

      if (currRender !== this.state.render.prev) {
        this.state.timers.sprite.val = 0
      }
      this.state.render.prev = this.state.render.curr
      this.state.render.curr = currRender
    }

    handleChampActions() {
      this.cleanActions()

      if (!this.queuedContains("moveX")) {
        this.processChampActionRaw({name: "stopX"})
      }

      if (!this.queuedContains("setFacingY")) {
        this.processChampActionRaw({name: "setFacingY", dir: "hor"})
      }

      for (const a of this.state.acceptQueue) {
        this.processChampActionRaw(a)
      }

      this.state.acceptQueue = []
    }

    queuedContains(act: ChampAction["name"]): boolean {
      return this.state.acceptQueue.some((a) => a.name === act)
    }

    cleanActions = () => {
      // A list of filters to find actions that are NOT allowed
      const notAllowedFilter = this.state.acceptQueue.reduce<
        ((act: ChampAction["name"]) => boolean)[]
      >((acc, curr) => {
        if (curr.name === "jump") {
          const allowedToJump =
            this.velocity[1] === 0 || this.state.jump.jumps === 0
          if (allowedToJump) {
            acc.push((a) => a === "setY")
          } else {
            acc.push((a) => a === "jump")
          }
        }
        if (curr.name === "melee" || curr.name === "shoot") {
          if (this.state.timers.actionCoolDownRemain.val > 0) {
            acc.push((a) => a === "melee" || a === "shoot")
          }
        }

        return acc
      }, [])

      for (const n of notAllowedFilter) {
        this.state.acceptQueue = this.state.acceptQueue.filter(
          (a) => !n(a.name)
        )
      }
    }

    processChampActionRaw(action: ChampAction) {
      processActionMap[action.name](this, action as never)
    }
  }
}

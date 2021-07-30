import { laMove } from "../utils/laMove";

export default {
  props: {
    delta: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      startPosition: null,
      downEvent: null,
      dragStarted: false,
      initialUserSelect: null
    };
  },
  mounted() {
    let el = this.$el;

    el.addEventListener("mousedown", this.onMouseDown);
  },
  methods: {
    onMouseDown(event) {
      let target;
      let goodButton;
      if (event.type === "mousedown") {
        const mouse = event;
        target = event.target;
        goodButton = mouse.buttons === 1;
      } else {
        const touch = event;
        target = touch.touches[0].target;
        goodButton = true;
      }
      let goodTarget =
        !this.handle || target.matches(this.handle + ", " + this.handle + " *");
      if (
        !this.disabled &&
        this.downEvent === null &&
        goodButton &&
        goodTarget
      ) {
        this.initialUserSelect = document.body.style.userSelect;
        document.documentElement.style.userSelect = "none";
        this.dragStarted = false;
        this.downEvent = event;
        if (this.downEvent.type === "mousedown") {
          const mouse = event;
          this.startPosition = {
            x: mouse.clientX,
            y: mouse.clientY
          };
        } else {
          const touch = event;
          this.startPosition = {
            x: touch.touches[0].clientX,
            y: touch.touches[0].clientY
          };
        }
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("la-move", this.onLaMove);
        document.addEventListener("touchmove", this.onMouseMove, {
          passive: false
        });
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("touchend", this.onMouseUp);
        document.addEventListener("selectstart", this.noop);
        // Prevents event from bubbling to ancestor drag components and initiate several drags at the same time
        event.stopPropagation();
        // Prevents touchstart event to be converted to mousedown
        //e.preventDefault();
      }
    },
    onMouseUp(e) {
      // On touch devices, we ignore fake mouse events and deal with touch events only.
      if (this.downEvent.type === "touchstart" && e.type === "mouseup") return;

      this.downEvent = null;

      // This delay makes sure that when the click event that results from the mouseup is produced, the drag is
      // still in progress. So by checking the flag dnd.inProgress, one can tell appart true clicks from drag and
      // drop artefacts.
      setTimeout(() => {
        if (this.dragStarted) {
          document.documentElement.classList.remove("drag-in-progress");
          laMove.stopDrag(e);
        }
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("touchmove", this.onMouseMove);
        document.removeEventListener("la-move", this.onLaMove);
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("touchend", this.onMouseUp);
        document.removeEventListener("selectstart", this.noop);
        document.documentElement.style.userSelect = this.initialUserSelect;
      }, 0);
    },
    noop(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onLaMove(e) {
      laMove.mouseMove(e, null);
    },
    onMouseMove(event) {
      console.log(33);
      // We ignore the mousemove event that follows touchend :
      if (this.downEvent === null) return;

      // On touch devices, we ignore fake mouse events and deal with touch events only.
      if (this.downEvent.type === "touchstart" && event.type === "mousemove")
        return;

      // Find out event target and pointer position :
      let target;
      let x;
      let y;
      if (event.type === "touchmove") {
        let touch = event;
        x = touch.touches[0].clientX;
        y = touch.touches[0].clientY;
        target = document.elementFromPoint(x, y);
        if (!target) {
          // Mouse going off screen. Ignore event.
          return;
        }
      } else {
        let mouse = event;
        x = mouse.clientX;
        y = mouse.clientY;
        target = mouse.target;
      }

      // Distance between current event and start position :
      let dist = Math.sqrt(
        Math.pow(this.startPosition.x - x, 2) +
          Math.pow(this.startPosition.y - y, 2)
      );

      // If the drag has not begun yet and distance from initial point is greater than delta, we start the drag :
      if (!this.dragStarted && dist > this.delta) {
        this.dragStarted = true;

        document.documentElement.classList.add("drag-in-progress");
      }

      // Dispatch custom easy-dnd-move event :
      if (this.dragStarted) {
        let custom = new CustomEvent("la-move", {
          bubbles: true,
          cancelable: true,
          detail: {
            x,
            y,
            native: event
          }
        });
        target.dispatchEvent(custom);
      }

      // Prevent scroll on touch devices :
      event.preventDefault();
    }
  }
};

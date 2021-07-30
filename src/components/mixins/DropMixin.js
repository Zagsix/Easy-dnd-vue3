import { laMove } from "../utils/laMove";

export default {
  data() {
    return {
      isDrop: true
    };
  },
  props: {
    acceptsType: null,
    acceptsData: null,
    mode: "",
    dragImageOpacity: null
  },
  methods: {
    /**
     * Returns true if the current drop area participates in the current drag operation.
     */
    candidate(type, data, source) {
      return this.effectiveAcceptsType(type);
    },

    createDragImage() {
      let image;
      if (this.$refs["drag-image"]) {
        let el = this.$refs["drag-image"];
        if (el.childElementCount !== 1) {
          image = this.createDragImage(el);
        } else {
          image = this.createDragImage(el.children.item(0));
        }
        image["__opacity"] = this.dragImageOpacity;
      } else {
        image = "source";
      }
      return image;
    },
    effectiveAcceptsType(type) {
      if (this.acceptsType === null) return true;
      else if (typeof this.acceptsType === "string")
        return this.acceptsType === type;
      else if (
        typeof this.acceptsType === "object" &&
        Array.isArray(this.acceptsType)
      ) {
        return this.acceptsType.includes(type);
      } else {
        return this.acceptsType(type);
      }
    },

    effectiveAcceptsData(data, type) {
      return this.acceptsData(data, type);
    }
  },

  created() {
    laMove.on("dragpositionchanged", this.onDragPositionChanged);
    laMove.on("dragtopchanged", this.onDragTopChanged);
    laMove.on("drop", this.onDrop);
  },

  destroyed() {
    laMove.off("dragpositionchanged", this.onDragPositionChanged);
    laMove.off("dragtopchanged", this.onDragTopChanged);
    laMove.off("drop", this.onDrop);
  },

  onDragPositionChanged(event) {
    if (this === event.top) {
      this.$emit("dragover", event);
    }
  },

  onDragTopChanged(event) {
    if (this === event.top) {
      this.$emit("dragenter", event);
    }
    if (this === event.previousTop) {
      this.$emit("dragleave", event);
    }
  },

  onDrop(event) {
    if (this.dropIn && this.compatibleMode && this.dropAllowed) {
      this.doDrop(event);
    }
  },

  doDrop(event) {
    this.$emit("drop", event);
    event.source.$emit(this.mode, event);
  },

  mounted() {
    let el = this.$el;
    let comp = this;
    el.addEventListener("la-move", onMouseMove);

    function onMouseMove(e) {
      laMove.mouseMove(e, comp);
    }
  },

  computed: {
    compatibleMode() {
      if (this.dragInProgress) {
        return (
          this.mode === "copy" ||
          laMove.sourceListeners.hasOwnProperty(this.mode)
        );
      } else {
        return null;
      }
    },

    dropIn() {
      if (this.dragInProgress) {
        return this.dragTop === this;
      } else {
        return null;
      }
    },

    typeAllowed() {
      if (this.dragInProgress) {
        return this.effectiveAcceptsType(this.dragType);
      } else {
        return null;
      }
    },

    dropAllowed() {
      if (this.dragInProgress) {
        if (this.typeAllowed) {
          return (
            this.compatibleMode &&
            this.effectiveAcceptsData(this.dragData, this.dragType)
          );
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    cssClasses() {
      let clazz = {
        "dnd-drop": true
      };
      if (this.dropIn !== null) {
        clazz = {
          ...clazz,
          "drop-in": this.dropIn,
          "drop-out": !this.dropIn
        };
      }
      if (this.typeAllowed !== null) {
        clazz = {
          ...clazz,
          "type-allowed": this.typeAllowed,
          "type-forbidden": !this.typeAllowed
        };
      }
      if (this.dropAllowed !== null) {
        clazz = {
          ...clazz,
          "drop-allowed": this.dropAllowed,
          "drop-forbidden": !this.dropAllowed
        };
      }
      return clazz;
    },

    cssStyle() {
      return {};
    }
  }
};

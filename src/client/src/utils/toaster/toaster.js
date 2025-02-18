// toaster.js
// version: 1.0.0
// repo: github.com/lullaby6/toaster.js

// todo:
// themes

class Toaster {
  constructor(options) {
    if (!document.querySelector("#toaster-positions")) ToasterInit();

    this.options = {
      id: crypto.randomUUID(),
      toast: null,
      html: null,
      type: "default",
      title: null,
      text: null,
      position: "top-right",
      duration: 3000,
      pauseDurationOnHover: false,
      delay: null,
      border: false,

      icon: true,
      closeButton: null,
      progressBar: null,

      button: null,

      hidePreviousToasts: false,
      hideLastToast: false,
      limit: null,
      waitLastToast: false,

      onClick: null,
      onMouseEnter: null,
      onMouseLeave: null,
      closeOnClick: false,
      closeOnDrag: false,
      onTop: true,

      className: {},
      style: {},
      attributes: {},

      onLoad: null,
      onShow: null,
      onHide: null,
      onChange: null,

      icons: {},
      animation: {},
      promise: null,

      ...options,
    };

    for (const [key, value] of Object.entries(this.options)) {
      this[key] = value;
    }

    this.icons = {
      default: null,
      dark: null,
      success:
        '<svg  xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>',
      info: '<svg xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" /></svg>',
      warning:
        '<svg  xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>',
      error:
        '<svg  xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-exclamation-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 11.66a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -7a1 1 0 0 0 -1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1" /></svg>',
      button:
        '<svg  xmlns="http://www.w3.org/2000/svg"  width="1em"  height="1em"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-hand-click"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" /><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" /><path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" /><path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /><path d="M5 3l-1 -1" /><path d="M4 7h-1" /><path d="M14 3l1 -1" /><path d="M15 6h1" /></svg>',
      close:
        '<svg xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',
      loading:
        '<svg xmlns="http://www.w3.org/2000/svg" width="1em"  height="1em"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9" /></svg>',
      ...options.icons,
    };

    this.animation = {
      duration: 300,
      easing: "ease-in-out",
      fade: true,
      scale: false,
      show: null,
      hide: null,
      ...options.animation,
    };

    this.load();
  }

  camelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  setElementClassName(element, className) {
    if (typeof className == "string") element.className = className;
    else if (typeof className == "object") element.classList.add(...className);
  }

  setElementStyle(element, style) {
    if (typeof style === "string") element.style.cssText = style;
    else if (typeof style === "object") {
      for (const key in style) {
        element.style[key] = style[key];
      }
    }
  }

  setElementAttributes(element, attributes) {
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }

  createElement(tag, name = null) {
    if (name === null) name = tag;
    const element = document.createElement(tag);

    if (this.className[name])
      this.setElementClassName(element, this.className[name]);
    if (this.style[name]) this.setElementStyle(element, this.style[name]);
    if (this.attributes[name])
      this.setElementStyle(element, this.attributes[name]);

    element.classList.add(`toaster-${this.camelCase(name)}`);

    return element;
  }

  show() {
    window.dispatchEvent(new Event("toaster.show.start"), { detail: this });
    this.$toast.dispatchEvent(new Event("toaster.show.start"));

    let animation = [{}, {}];
    let duration = this.animation.duration;
    let easing = this.animation.easing;

    if (this.animation.show) {
      if (this.animation.show.custom) animation = this.animation.show.custom;

      if (this.animation.show.duration) duration = this.animation.show.duration;

      if (this.animation.show.easing) easing = this.animation.hide.easing;
    } else {
      if (this.animation.fade) {
        animation[0].opacity = 0;
        animation[1].opacity = 1;
      }

      if (this.animation.scale) {
        animation[0].scale = 0;
        animation[1].scale = 1;
      }
    }

    if (this.duration > 0 && duration > this.duration) duration = this.duration;

    this.showAnimation = this.$toast.animate(animation, {
      duration: duration,
      easing: easing,
      fill: "forwards",
    });

    this.showAnimation.onfinish = (event) => {
      if (this.onShow) this.onShow(event);

      window.dispatchEvent(new Event("toaster.show.end"), { detail: this });
      this.$toast.dispatchEvent(new Event("toaster.show.end"));
    };
  }

  hide() {
    if (!this.$toast) return;

    if (this.$toast.dataset.toasterHiding === "true") return;
    this.$toast.dataset.toasterHiding = "true";

    window.dispatchEvent(new Event("toaster.hide.start"), { detail: this });
    this.$toast.dispatchEvent(new Event("toaster.hide.start"));

    let animation = [{}, {}];
    let duration = this.animation.duration;
    let easing = this.animation.easing;

    if (this.animation.hide) {
      if (this.animation.hide.custom) animation = this.animation.hide.custom;

      if (this.animation.hide.duration) duration = this.animation.hide.duration;

      if (this.animation.hide.easing) easing = this.animation.hide.easing;
    } else {
      if (this.animation.fade) {
        animation[0].opacity = 1;
        animation[1].opacity = 0;
      }

      if (this.animation.scale) {
        animation[0].scale = 1;
        animation[1].scale = 0;
      }
    }

    if (this.duration > 0 && duration > this.duration) duration = this.duration;

    this.hideAnimation = this.$toast.animate(animation, {
      duration: duration,
      easing: easing,
      fill: "forwards",
    });

    this.hideAnimation.onfinish = (event) => {
      if (this.onHide) this.onHide(event);

      window.dispatchEvent(new Event("toaster.hide.end"), { detail: this });
      this.$toast.dispatchEvent(new Event("toaster.hide.end"));

      this.$toast.remove();

      this.$toast = undefined;
    };
  }

  stopHide() {
    if (this.hideAnimation) {
      this.$toast.dataset.toasterHiding = "false";
      delete this.$toast.dataset.toasterHiding;

      this.hideAnimation.cancel();
      this.hideAnimation = null;

      window.dispatchEvent(new Event("toaster.hide.stop"), { detail: this });
      this.$toast.dispatchEvent(new Event("toaster.hide.stop"));
    }
  }

  closeOnDragStart(x) {
    this.closeOnDragging = true;
    this.closeOnDragStartX = x - this.$toast.getBoundingClientRect().left;
  }

  closeOnDragCancel() {
    if (this.$toast && this.closeOnDragging) {
      this.closeOnDragging = false;

      this.$toast.animate(
        [
          {
            translate: "0 0",
            opacity: 1,
          },
        ],
        {
          duration: 100,
          fill: "forwards",
          easing: "ease-in-out",
        }
      );
    }
  }

  closeOnDragMove(x) {
    if (this.$toast && this.closeOnDragging) {
      x = x - this.$toast.getBoundingClientRect().left - this.closeOnDragStartX;
      const width = this.$toast.getBoundingClientRect().width;

      const dragPercent = this.closeOnDrag.percent || 0.5;
      const threshold = width * dragPercent;

      const opacity = Math.max(1 - Math.abs(x) / threshold, 0);

      this.$toast.animate([{ translate: `${x}px 0`, opacity }], {
        duration: 100,
        fill: "forwards",
        easing: "ease-in-out",
      });

      if (Math.abs(x) >= threshold) {
        this.animation.duration = 0;
        this.hide();
      }
    }
  }

  createToast() {
    this.$toast = this.createElement("div", "toast");

    this.$toast.Toaster = this;
    this.$toast.classList.add("toaster", `toaster-${this.id}`);
    this.$toast.dataset.toasterId = this.id;
    this.$toast.dataset.toasterIndex = this.index;
    this.$toast.dataset.toasterDate = Date.now();

    let method = "prepend";
    if (this.onTop === false) method = "append";

    document
      .querySelector(`[data-toaster-position="${this.position}"]`)
      [method](this.$toast);

    if (this.onLoad) this.onLoad(this.$toast);

    if (this.closeOnClick)
      this.$toast.addEventListener("click", this.hide.bind(this));
    if (this.closeOnDrag) {
      this.closeOnDragging = false;

      this.$toast.addEventListener("mousedown", (event) =>
        this.closeOnDragStart(event.clientX)
      );

      this.$toast.addEventListener("touchstart", (event) =>
        this.closeOnDragStart(event.touches[0].clientX)
      );

      window.addEventListener("mouseup", this.closeOnDragCancel.bind(this));

      window.addEventListener("touchend", this.closeOnDragCancel.bind(this));

      window.addEventListener("touchcancel", this.closeOnDragCancel.bind(this));

      window.addEventListener("touchmove", (event) =>
        this.closeOnDragMove(event.touches[0].clientX)
      );

      window.addEventListener("mousemove", (event) =>
        this.closeOnDragMove(event.clientX)
      );
    }

    if (this.onClick)
      this.$toast.addEventListener("click", (event) =>
        this.onClick(event, this)
      );
    if (this.onMouseEnter)
      this.$toast.addEventListener("mouseenter", (event) =>
        this.onMouseEnter(event, this)
      );
    if (this.onMouseLeave)
      this.$toast.addEventListener("mouseleave", (event) =>
        this.onMouseLeave(event, this)
      );

    window.dispatchEvent(new Event("toaster.load"), { detail: this });
    this.$toast.dispatchEvent(new Event("toaster.load"));
  }

  loadToast() {
    this.$toast.innerHTML = "";

    this.$toast.classList.add(`toaster-${this.type}`);

    if (this.border) this.$toast.classList.add("toaster-border");
  }

  createIcon() {
    this.$icon = this.createElement("div", "icon");
    this.$toast.append(this.$icon);
    this.$icon.innerHTML = this.icons[this.type];
  }

  createTitle() {
    this.$title = this.createElement("h4", "title");
    this.$title.textContent = this.title;
    this.$contentText.append(this.$title);
  }

  createText() {
    this.$text = this.createElement("p", "text");
    this.$text.textContent = this.text;
    this.$contentText.append(this.$text);
  }

  createButton() {
    this.$button = this.createElement("div", "button");

    if (this.button.text) this.$button.textContent = this.button.text;

    if (this.button.icon && this.icons["button"]) {
      this.$buttonIcon = this.createElement("div", "buttonIcon");

      if (this.button.icon === true)
        this.$buttonIcon.innerHTML = this.icons["button"];
      else this.$buttonIcon.innerHTML = this.button.icon;

      this.$button.prepend(this.$buttonIcon);
    }

    if (this.button.html) {
      this.$button.innerHTML = this.button.html;
    }

    this.$content.append(this.$button);

    if (this.button.onClick)
      this.$button.addEventListener("click", (event) =>
        this.button.onClick(event, this)
      );
  }

  createCloseButton() {
    this.$closeButton = this.createElement("div", "closeButton");
    this.$closeButton.innerHTML = this.icons["close"];

    if (this.closeButton.icon)
      this.$closeButton.innerHTML = this.progressBar.icon;
    if (this.closeButton.topRight)
      this.$closeButton.classList.add("toaster-close-button-top-right");

    if (this.closeButton.onlyShowOnHover) {
      this.$closeButton.style.opacity = 0;

      this.$toast.removeEventListener(
        "mouseenter",
        () => (this.$closeButton.style.opacity = 0.5)
      );
      this.$toast.addEventListener(
        "mouseenter",
        () => (this.$closeButton.style.opacity = 0.5)
      );

      this.$toast.removeEventListener(
        "mouseleave",
        () => (this.$closeButton.style.opacity = 0)
      );
      this.$toast.addEventListener(
        "mouseleave",
        () => (this.$closeButton.style.opacity = 0)
      );

      this.$closeButton.addEventListener(
        "mouseover",
        () => (this.$closeButton.style.opacity = 1)
      );
    }

    this.$toast.append(this.$closeButton);

    this.$closeButton.addEventListener("click", this.hide.bind(this));
  }

  createProgressBar() {
    this.$progressBar = this.createElement("span", "progressBar");

    if (this.progressBar.onTop)
      this.$progressBar.classList.add("toaster-progress-bar-top");

    this.$toast.append(this.$progressBar);

    if (this.duration > 0) {
      this.durationTimeout = setTimeout(() => this.hide(), this.duration);

      this.durationTimeoutStartTime = Date.now();
      this.durationTimeoutResumeTime = Date.now();
      this.durationTimeoutTimeLeft = this.duration;

      if (this.progressBar && this.$progressBar) {
        this.durationInterval = setInterval(() => {
          const durationPercentage =
            ((Date.now() - this.durationTimeoutStartTime) * 100) /
            this.duration;

          this.$progressBar.style.width = `${durationPercentage}%`;
        }, 1);
      }
    }
  }

  getIndex() {
    let index = 0;

    document.querySelectorAll(".toaster").forEach((toast) => {
      if (toast.dataset.toasterIndex >= index)
        index = parseInt(toast.dataset.toasterIndex) + 1;
    });

    return index;
  }

  setLimit() {
    const toasts = Array.from(document.querySelectorAll(".toaster"))
      .filter((toast) => toast.dataset.toasterHiding !== "true")
      .sort((a, b) => a.dataset.toasterIndex - b.dataset.toasterIndex);

    const length = toasts.length + 1;

    if (length > this.limit) {
      toasts.length = length - this.limit;

      toasts.forEach((toast) => toast.Toaster.hide());
    }
  }

  async handlePromise() {
    this.duration = 0;
    this.type = "loading";

    let type = "default";
    let resultOptions = {};
    let promiseOptions = {};

    try {
      let result = null;

      if (this.promise.timeout && this.promise.timeout.time) {
        const timeoutPromise = new Promise(
          (_, reject) =>
            (this.promiseTimeout = setTimeout(() => {
              if (this.promise && this.promise.timeout) {
                if (this.promise.timeout.callback)
                  this.promise.timeout.callback(this);

                reject(
                  new Error(
                    this.promise.timeout.text ||
                      `Timed out after ${this.promise.timeout.time}ms`
                  )
                );
              }
            }, this.promise.timeout.time))
        );

        result = await Promise.race([this.promise.callback(), timeoutPromise]);
      } else {
        result = await this.promise.callback();
      }

      clearTimeout(this.promiseTimeout);

      type = "success";

      if (this.promise.then) {
        if (this.promise.then.callback)
          resultOptions = await this.promise.then.callback(result, this);

        if (this.promise.then.options)
          promiseOptions = this.promise.then.options;
      }
    } catch (error) {
      type = "error";

      if (this.promise.catch) {
        if (this.promise.catch.callback)
          resultOptions = await this.promise.then.callback(error, this);

        if (this.promise.catch.options)
          promiseOptions = this.promise.catch.options;
      }
    }

    this.update({
      ...promiseOptions,
      ...resultOptions,
      type,
      duration: this.options.duration,
      promise: null,
    });
  }

  retryPromise() {
    if (this.options.promise) {
      this.$toast.classList.remove(`toaster-${this.type}`);

      this.promise = this.options.promise;

      this.handlePromise();

      const retryOptions = {
        ...this.options,
      };

      delete retryOptions.icons;
      delete retryOptions.animation;
      delete retryOptions.duration;
      delete retryOptions.type;

      this.update(retryOptions);
    }
  }

  update(options) {
    if (this.$toast) {
      this.stopHide();

      if (options.type) this.$toast.classList.remove(`toaster-${this.type}`);

      if (options.duration) clearTimeout(this.durationTimeout);
    }

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }

    this.render();
  }

  async load() {
    if (
      !this.$toast &&
      document.querySelector(`.toaster[data-toaster-id="${this.id}"]`)
    )
      return;

    if (!document.querySelector("#toaster-positions"))
      await new Promise((resolve) =>
        window.addEventListener("toaster.init", resolve)
      );

    if (this.delay && this.delay > 0)
      await new Promise((resolve) => setTimeout(resolve, this.delay));

    if (this.hidePreviousToasts)
      document
        .querySelectorAll(".toaster")
        .forEach((toast) => toast.Toaster.hide());

    this.index = this.getIndex();

    const lastToast = document.querySelector(
      `.toaster[data-toaster-index="${this.index - 1}"]`
    );

    if (lastToast) {
      if (this.hideLastToast) lastToast.Toaster.hide();

      if (this.waitLastToast)
        await new Promise((resolve) =>
          lastToast.addEventListener("toaster.hide.end", resolve)
        );
    }

    if (this.limit) this.setLimit();

    if (this.promise && this.promise.callback) this.handlePromise();

    this.render();

    this.show();
  }

  handleDurationMouseEnter() {
    this.stopHide();

    clearTimeout(this.durationTimeout);
    this.durationTimeout = null;

    clearInterval(this.durationInterval);
    this.durationInterval = null;

    this.durationTimeLeft -= Date.now() - this.durationResumeTime;
  }

  hamdleDurationMouseLeave() {
    this.durationResumeTime = Date.now();
    this.durationTimeout = setTimeout(
      this.hide.bind(this),
      this.durationTimeLeft
    );

    if (this.progressBar) {
      const currentProgressPercentage =
        (parseFloat(window.getComputedStyle(this.$progressBar).width) /
          this.$progressBar.parentElement.clientWidth) *
        100;

      const remainingPercentage = (this.durationTimeLeft / this.duration) * 100;

      this.durationInterval = setInterval(() => {
        const elapsed = Date.now() - this.durationResumeTime;
        const percentage =
          (elapsed / this.durationTimeLeft) * remainingPercentage;

        this.$progressBar.style.width = `${
          currentProgressPercentage + percentage
        }%`;
      }, 1);
    }
  }

  handleDuration() {
    if (this.duration > 0) {
      clearTimeout(this.durationTimeout);
      this.durationTimeout = null;
      this.durationTimeout = setTimeout(this.hide.bind(this), this.duration);

      if (this.pauseDurationOnHover) {
        this.durationResumeTime = Date.now();
        this.durationTimeLeft = this.duration;

        this.$toast.removeEventListener(
          "mouseenter",
          this.handleDurationMouseEnter.bind(this)
        );
        this.$toast.addEventListener(
          "mouseenter",
          this.handleDurationMouseEnter.bind(this)
        );

        this.$toast.removeEventListener(
          "mouseleave",
          this.hamdleDurationMouseLeave.bind(this)
        );
        this.$toast.addEventListener(
          "mouseleave",
          this.hamdleDurationMouseLeave.bind(this)
        );
      }
    }
  }

  render() {
    if (this.$toast === undefined) this.createToast();
    else if (this.onChange) {
      this.onChange(this.$toast);
      window.dispatchEvent(new Event("toaster.change"), { detail: this });
      this.$toast.dispatchEvent(new Event("toaster.change"));
    }
    this.loadToast();

    window.dispatchEvent(new Event("toaster.render"), { detail: this });
    this.$toast.dispatchEvent(new Event("toaster.render"));

    if (this.html) return (this.$toast.innerHTML = this.html);

    if (this.icon && this.icons[this.type]) this.createIcon();

    this.$content = this.createElement("div", "content");
    this.$toast.append(this.$content);

    if (this.title || this.text) {
      this.$contentText = this.createElement("div", "contentText");
      this.$content.append(this.$contentText);
    }

    if (this.title) this.createTitle();

    if (this.text) this.createText();

    if (this.button) this.createButton();

    if (this.closeButton && this.icons["close"]) this.createCloseButton();

    if (this.progressBar) this.createProgressBar();

    this.handleDuration();
  }
}

function ToasterHide(toast) {
  if (typeof toast === "string")
    toast = document.querySelector(`.toaster[data-toaster-id="${toast}"]`);

  toast.Toaster.hide();
}

function ToasterHideAll() {
  document.querySelectorAll(".toaster").forEach(ToasterHide);
}

function ToasterInit() {
  if (document.querySelector("#toaster-positions")) return;

  const positions = [
    "top-left",
    "top",
    "top-right",
    "bottom-left",
    "bottom",
    "bottom-right",
  ];

  const $positions = document.createElement("div");
  $positions.id = "toaster-positions";
  document.body.appendChild($positions);

  positions.forEach((position) => {
    const $position = document.createElement("div");
    $position.id = `toaster-position-${position}`;
    $position.classList.add("toaster-position");
    $position.dataset.toasterPosition = position;

    if (position.startsWith("top"))
      $position.classList.add("toaster-position-top");
    else $position.classList.add("toaster-position-bottom");

    if (position.endsWith("left"))
      $position.classList.add("toaster-position-left");
    else $position.classList.add("toaster-position-right");

    $positions.appendChild($position);
  });

  window.dispatchEvent(new Event("toaster.init"));
}

// window.addEventListener("DOMContentLoaded", ToasterInit);

export {
  Toaster,
  ToasterHide,
  ToasterHideAll,
  ToasterInit
}
import config from '../config.js';

let uid = 0;
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
class Dep {
    constructor() {
        // pending subs cleanup
        this._pending = false;
        this.id = uid++;
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        // #12696 deps with massive amount of subscribers are extremely slow to
        // clean up in Chromium
        // to workaround this, we unset the sub for now, and clear them on
        // next scheduler flush.
        this.subs[this.subs.indexOf(sub)] = null;
        if (!this._pending) {
            this._pending = true;
        }
    }
    depend(info) {
        if (Dep.target) {
            Dep.target.addDep(this);
            if (process.env.NODE_ENV !== 'production' && info && Dep.target.onTrack) {
                Dep.target.onTrack(Object.assign({ effect: Dep.target }, info));
            }
        }
    }
    notify(info) {
        // stabilize the subscriber list first
        const subs = this.subs.filter(s => s);
        if (process.env.NODE_ENV !== 'production' && !config.async) {
            // subs aren't sorted in scheduler if not running async
            // we need to sort them now to make sure they fire in correct
            // order
            subs.sort((a, b) => a.id - b.id);
        }
        for (let i = 0, l = subs.length; i < l; i++) {
            const sub = subs[i];
            if (process.env.NODE_ENV !== 'production' && info) {
                sub.onTrigger &&
                    sub.onTrigger(Object.assign({ effect: subs[i] }, info));
            }
            sub.update();
        }
    }
}
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
const targetStack = [];
function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}

export { Dep as default, popTarget, pushTarget };

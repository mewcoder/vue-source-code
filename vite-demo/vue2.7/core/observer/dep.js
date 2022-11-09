/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { __assign } from '../../_virtual/_tslib.js';
import config from '../config.js';

var uid = 0;
var pendingCleanupDeps = [];
var cleanupDeps = function () {
    for (var i = 0; i < pendingCleanupDeps.length; i++) {
        var dep = pendingCleanupDeps[i];
        dep.subs = dep.subs.filter(function (s) { return s; });
        dep._pending = false;
    }
    pendingCleanupDeps.length = 0;
};
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
var Dep = /** @class */ (function () {
    function Dep() {
        // pending subs cleanup
        this._pending = false;
        this.id = uid++;
        this.subs = [];
    }
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };
    Dep.prototype.removeSub = function (sub) {
        // #12696 deps with massive amount of subscribers are extremely slow to
        // clean up in Chromium
        // to workaround this, we unset the sub for now, and clear them on
        // next scheduler flush.
        this.subs[this.subs.indexOf(sub)] = null;
        if (!this._pending) {
            this._pending = true;
            pendingCleanupDeps.push(this);
        }
    };
    Dep.prototype.depend = function (info) {
        if (Dep.target) {
            Dep.target.addDep(this);
            if (info && Dep.target.onTrack) {
                Dep.target.onTrack(__assign({ effect: Dep.target }, info));
            }
        }
    };
    Dep.prototype.notify = function (info) {
        // stabilize the subscriber list first
        var subs = this.subs.filter(function (s) { return s; });
        if (!config.async) {
            // subs aren't sorted in scheduler if not running async
            // we need to sort them now to make sure they fire in correct
            // order
            subs.sort(function (a, b) { return a.id - b.id; });
        }
        for (var i = 0, l = subs.length; i < l; i++) {
            var sub = subs[i];
            if (info) {
                sub.onTrigger &&
                    sub.onTrigger(__assign({ effect: subs[i] }, info));
            }
            sub.update();
        }
    };
    return Dep;
}());
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];
function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}

export { cleanupDeps, Dep as default, popTarget, pushTarget };

// class TaskQueue {
//
//     maxConcurrency = 4;
//
//     _pause = false;
//
//     _isCancel = false;
//
//     /** @type { Array<Promise> } */
//     runningTask = [];
//
//     /** @type { () => ({ task: Promise, onCompleted: Function, onFailed: Function }) } */
//     onFetch = null;
//
//     /**
//      * @returns {Promise<never>|Promise<void>}
//      */
//     handle() {
//
//         if (this._pause) return Promise.reject("暂停中");
//
//         // 如果没有任务则不处理
//         const { task, onCompleted, onFailed } = this.onFetch() ?? {};
//         if (!task) return Promise.resolve();
//
//         task.then(
//             () => {
//                 this.runningTask.splice(this.runningTask.indexOf(task), 1);
//                 onCompleted();
//             },
//             (err) => {
//                 this._pause = true;
//                 onFailed();
//                 return Promise.reject(err);
//             }
//         );
//         this.runningTask.push(task);
//
//         let p = Promise.resolve();
//         if (this.runningTask.length > this.maxConcurrency) {
//             p = Promise.race(this.runningTask);
//         }
//
//         return p.then(() => this.handle());
//     }
//
//     pause() {
//         this._pause = true;
//     }
//
//     resume() {
//         this._pause = false;
//         this.handle();
//     }
//
//     cancel() {
//         this._isCancel = true;
//     }
//
// }

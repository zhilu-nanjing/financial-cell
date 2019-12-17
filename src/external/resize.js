function Resize(options, self) {

    this.register = function (el) {
        let directionsArr = [];
        let directions = ['nw', 'w', 'ws', 's', 'se', 'e', 'ne', 'n'];
        //增加元素
        directions.forEach(str => {
            //direction ws

            let div = document.createElement('div');
            div.style.display = "block";
            div.className = 'direction ' + str;
            //注册事件

            directionsArr.push(div);
            el.appendChild(div);
        });

        for(let i = 0; i < 4; i++) {
            let line = document.createElement('div');
            line.style.display = "block";
            line.className = `line${i+1}`;
            el.appendChild(line);
            directionsArr.push(line);
        }


        let border = document.createElement('div');
        border.className = 'border';
        el.appendChild(border);


        //注册事件

        directions.forEach(str => {
            let obj = el.querySelector("." + str);
            obj.onmousedown = function (e) {

                if (e.button !== 0) {
                    return;
                }

                let ox = e.clientX;
                let oy = e.clientY;

                let data = {
                    ox: ox,
                    oy: oy,
                    ow: el.offsetWidth,
                    oh: el.offsetHeight,
                    ol: el.offsetLeft,
                    ot: el.offsetTop

                };

                if (options && options.onBegin) {
                    options.onBegin.call(el,data)
                }

                let isResize = true;
                window.onmousemove = function (event) {
                    if (!isResize) {
                        return;
                    }
                    let x = event.clientX;
                    let y = event.clientY;

                    //计算 width和height 差值

                    let width = x - data.ox;
                    let height = y - data.oy;


                    data.width = width;
                    data.height = height;

                    let fun = mappers[str];
                    if (fun) {
                        fun.call(obj, data, event);
                    }

                    event.stopPropagation();
                };
                window.onmouseup = function (ee) {
                    isResize = false;
                    ee.stopPropagation();

                    if (options && options.onEnd) {
                        options.onEnd.call(el)
                    }
                };

                //阻止事件冒泡
                e.stopPropagation()
            }

        });


        if (!options) {
            options = {
                onResize: function () {

                }
            }
        } else if (!options.onResize) {
            options.onResize = function () {

            }
        }

        function setLeft(l) {
            options.onResize({left: l}, self);
            el.style.left = l + 'px';
        }

        function setTop(t) {
            options.onResize({top: t}, self);
            el.style.top = t + 'px';
        }

        function setWidth(w) {
            if (w < 20) {
                w = 20;
            }
            options.onResize({width: w}, self);
            el.style.width = w + 'px';
        }

        function setHeight(h) {

            if (h < 20) {
                h = 20;
            }
            options.onResize({height: h}, self);
            el.style.height = h + 'px';
        }

        let mappers = {
            s: function (data) {
                setHeight(data.oh + data.height);
            },
            e: function (data) {
                setWidth(data.ow + data.width)
            },
            w: function (data) {
                let value = data.width;


                let l = data.ol + value;
                let w = data.ow + Math.abs(value);

                if (value > 0) {
                    w = data.ow - value;
                }

                if (w > 20) {
                    setLeft(l);
                    setWidth(w);
                }
            },
            n: function (data) {
                let value = data.height;

                let t = data.ot + value;
                let h = data.oh + Math.abs(value);

                if (value > 0) {
                    h = data.oh - value;
                }
                if (h > 20) {
                    setHeight(h);
                    setTop(t);
                }
            },
            se: function (data) {
                mappers.s(data);
                mappers.e(data);
            },
            nw: function (data) {
                mappers.n(data);
                mappers.w(data);
            },
            ws: function (data) {
                mappers.w(data);
                mappers.s(data);
            },
            ne: function (data) {
                mappers.n(data);
                mappers.e(data);
            }
        };

        // el.querySelector()
        return directionsArr;
    }
}

export default Resize;

'use strict';

const Fs = require('fs');
const Path = require('path');

exports.template = Fs.readFileSync(Path.join(__dirname, './block.html'), 'utf-8');

exports.props = ['layout'];

exports.components = {
    block: exports,
    split: require('./split')
};

exports.data = function () {
    return {};
};

var getType = function (style) {
    if (style.width) {
        return 'width';
    } else if (style.height) {
        return 'height';
    } else if (style.flex) {
        return 'flex';
    }
    return 'unknown';
};

var getFlexOffset = function (childNodes, childData, type) {
    var offset = 0;
    childNodes.forEach(function ($child, index) {
        var child = childData[index];
        if (getType(child.style) === 'flex') {
            offset += $child[type];
        }
    });
    return offset;
};

var toTempData = function (childNodes, children, flexTotalOffset, type) {
    return children.map(function (child, index) {
        var data = {};
        data['drag'] = child.drag;
        data['type'] = getType(child.style);

        var style = child.style;
        if (data['type'] === 'flex') {
            let flex = parseFloat(style['flex']);
            if (type === 'width') {
                data[type] = childNodes[index]['clientWidth'];
            } else {
                data[type] = childNodes[index]['clientHeight'];
            }
        } else {
            data[type] = parseInt(style[type]);
        }

        var minOffset = parseInt(style[`min-${type}`]);
        if (isNaN(minOffset)) {
            minOffset = type === 'width' ? 100 : 20;
        }
        data['min'] = minOffset;
        return data;
    });
};

var fromTempData = function (tempData, childData, flexTotalOffset, type) {
    tempData.forEach(function (childTemp, index) {
        switch (childTemp.type) {
            case 'flex':
                childData[index].style['flex'] = childTemp[type] / flexTotalOffset;
                break;
            case type:
                childData[index].style[type] = childTemp[type] + 'px';
                break;
        }
    });
};

var forwardMovement = function (index, moveOffset, childTemp, flexTotalOffset, type) {
    var count = 0;
    for (let i=index; i<childTemp.length && moveOffset>0; i++) {
        let child = childTemp[i];
        if (count === 0) {
            if (child.drag === false) {
                return flexTotalOffset;
            }
            if (child.type === type) {
                flexTotalOffset -= moveOffset;
            }
            child[type] += moveOffset;
        } else {
            if (child.drag) {
                child[type] -= moveOffset;
                if (child.type === type && count >= 2) {
                    // 移动计数超过 2，说明此元素不在拖动的左右两侧
                    // 而不在左右两侧的话，远处的 width | height 类型区块不应该缩小
                    child[type] += moveOffset;
                } else {
                    if (child['min'] - child[type] > 0) {
                        // 区块宽度小于最小宽度
                        // 将宽度重置成最小宽度，并且将超过的部分还原回 moveOffset 中
                        moveOffset = child['min'] - child[type];
                        child[type] = child['min'];
                    } else {
                        moveOffset = 0;
                    }
                }
            }
        }
        count++;
    }
    childTemp[index][type] -= moveOffset;
    if (childTemp[index]['type'] === type) {
        flexTotalOffset += moveOffset;
    }
    return flexTotalOffset;
};

var reverseMovement = function (index, moveOffset, childTemp, flexTotalOffset, type) {
    var count = 0;
    moveOffset = -moveOffset;
    for (let i=index+1; i>=0 && moveOffset>0; i--) {
        let child = childTemp[i];
        if (count === 0) {
            if (child.drag === false) {
                return flexTotalOffset;
            }
            if (child.type === type) {
                flexTotalOffset -= moveOffset;
            }
            child[type] += moveOffset;
        } else {
            if (child.drag) {
                child[type] -= moveOffset;
                if (child.type === type && count >= 2) {
                    // 移动计数超过 2，说明此元素不在拖动的左右两侧
                    // 而不在左右两侧的话，远处的 width | height 类型区块不应该缩小
                    child[type] += moveOffset;
                } else {
                    if (child['min'] - child[type] > 0) {
                        // 区块宽度小于最小宽度
                        // 将宽度重置成最小宽度，并且将超过的部分还原回 moveOffset 中
                        moveOffset = child['min'] - child[type];
                        child[type] = child['min'];
                    } else {
                        moveOffset = 0;
                    }
                }
            }
        }
        count++;
    }
    childTemp[index+1][type] -= moveOffset;
    if (childTemp[index+1]['type'] === type) {
        flexTotalOffset += moveOffset;
    }
    return flexTotalOffset;
};

var doLayout = {
    'row' (childNodes, offset, children) {
        // 计算可供自适应分配的宽度
        // 去除固定的 width 后，所有的都是自适应可分配宽度
        var flexTotalWidth = getFlexOffset(childNodes, children, 'clientWidth');

        // 将 children 全部转成宽度为单位的临时数据
        var childTemp = toTempData(childNodes, children, flexTotalWidth, 'width');

        if (offset.x > 0) {
            // 从左向右拖动
            flexTotalWidth = forwardMovement(offset.index, offset.x, childTemp, flexTotalWidth, 'width');
        } else {
            // 从右向左拖动
            flexTotalWidth = reverseMovement(offset.index, offset.x, childTemp, flexTotalWidth, 'width');
        }

        // 将转换后的临时数据恢复成布局数据
        fromTempData(childTemp, children, flexTotalWidth, 'width');
    },

    'column' (childNodes, offset, children) {
        // 计算可供自适应分配的宽度
        // 去除固定的 height 后，所有的都是自适应可分配宽度
        var flexTotalHeight = getFlexOffset(childNodes, children, 'clientHeight');

        // 将 children 全部转成宽度为单位的临时数据
        var childTemp = toTempData(childNodes, children, flexTotalHeight, 'height');

        if (offset.y > 0) {
            // 从上向下拖动
            flexTotalHeight = forwardMovement(offset.index, offset.y, childTemp, flexTotalHeight, 'height');
        } else {
            // 从下向上
            flexTotalHeight = reverseMovement(offset.index, offset.y, childTemp, flexTotalHeight, 'height');
        }

        // 将转换后的临时数据恢复成布局数据
        fromTempData(childTemp, children, flexTotalHeight, 'height');
    }
};

exports.methods = {
    _doLayout (event) {
        event.stopPropagation();
        var $wrap = event.target.parentElement.parentElement;
        var $children = Array.prototype.filter.call($wrap.childNodes, function (child) {
            return /layout-item/.test(child.className);
        });
        var direction = this.layout.style['flex-direction'] || 'row';
        doLayout[direction]($children, event.dragOffset, this.layout.children);
    }
};
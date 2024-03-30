var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FilesystemNode = /** @class */ (function () {
    function FilesystemNode(name, value, flags) {
        this.name = name;
        this.value = value;
        this.flags = flags;
    }
    return FilesystemNode;
}());
var VirtualDirectory = /** @class */ (function (_super) {
    __extends(VirtualDirectory, _super);
    function VirtualDirectory(name) {
        return _super.call(this, name, [], {
            Type: "folder"
        }) || this;
    }
    VirtualDirectory.prototype.addFile = function (node) {
        this.value.push(node);
        node.parent = this;
    };
    VirtualDirectory.prototype.queryNodes = function (nodeType) {
        var files = [];
        this.value.forEach(function (fsnode) {
            if (fsnode.flags.Type == nodeType) {
                files.push(fsnode.name);
            }
        });
        return files;
    };
    VirtualDirectory.prototype.getPath = function (path) {
        var pathParts = path.split("/");
        var currentPos = this;
        for (var index = 0; index < pathParts.length; index++) {
            var pathPart = pathParts[index];
            if (currentPos.flags.Type == "file")
                throw new Error("Attempted to access file as folder");
            if (pathPart == ".")
                continue;
            if (pathPart == "..") {
                if (currentPos.parent)
                    currentPos = currentPos.parent;
                else {
                    throw new Error("Attempted to access parent of root directory");
                }
            }
            for (var j = 0; j < currentPos.value.length; j++) {
                var childNode = currentPos.value[j];
                if (childNode.name == pathPart) {
                    currentPos = childNode;
                    break;
                }
            }
        }
        return currentPos;
    };
    VirtualDirectory.prototype.getAbsPath = function () {
        if (!this.parent)
            return "/";
        var absPath = "";
        var elements = [
            this.name
        ];
        var currentPos = this;
        while (currentPos.parent) {
            currentPos = currentPos.parent;
            elements.push(currentPos.name);
        }
        elements.reverse().forEach(function (element) {
            if (element.length > 0)
                absPath += "/" + element;
        });
        return absPath;
    };
    return VirtualDirectory;
}(FilesystemNode));

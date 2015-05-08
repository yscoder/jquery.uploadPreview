/*
* uploadPreview v0.0.2
* https://github.com/yscoder/jquery.uploadPreview
* 2015.5.8
*/
(function($) {
    jQuery.fn.extend({
        uploadPreview: function(opts) {
            opts = jQuery.extend({
                width: null,    
                height: null,
                fillBox: false,    // true: 图片充满容器，false: 等比缩放
                imgDiv: "#imgDiv",  // 图片预览容器
                anyTarget: null,    // 其他关联容器，多个容器逗号隔开，如 "#div1,#div2"
                maxSize: 300,       // 图片大小限制，单位 Kb
                imgType: ["gif", "jpeg", "jpg", "bmp", "png"],  // 图片类型限制
                callback: function() { return false; }  // 预览完成后的回调
            }, opts || {});

            var _this = $(this);
            var imgDiv = $(opts.imgDiv);
            opts.width && imgDiv.width(opts.width);
            opts.height && imgDiv.height(opts.height);
             
            var isIE = navigator.appName == 'Microsoft Internet Explorer', 
                brVersion = navigator.appVersion, version;
            isIE && (version = brVersion.split(';')[1].replace(/MSIE[ ]/g,'').replace('.0',''));

            handle = function() {
                var img = imgDiv.find('img');
                opts.anyTarget && $.each(opts.anyTarget.split(','), function(index, val) {
                    $(val).html(img.clone());
                });
                opts.fillBox ? img.width(opts.width).height(opts.height) : autoResize(img);
                opts.callback(img);
            },
            autoResize = function(img) {
                var maxHeight = opts.height,
                    maxWidth  = opts.width;
                if(img.height() > maxHeight) {
                    var scale = maxHeight / img.height();
                    img.width(img.width() * scale);
                    img.height(maxHeight);
                } 
                if(img.width() > maxWidth) {
                    var scale = maxWidth / img.width();
                    img.height(img.height() * scale);
                    img.width(maxWidth);
                } 
                var ml = (opts.width - img.width()) / 2,
                    mt = (opts.height - img.height()) / 2;
                img.parent().css({
                    'margin-left': ml + 'px',
                    'margin-top' : mt + 'px'
                });
            },
            createImg = function(){
                imgDiv.html('');
                
                var img = $("<img />");
                imgDiv.append(img);
                return img;
            },
   
            _this.change(function() {
                
                if (this.value) {
                    if (!RegExp("\.(" + opts.imgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                        alert("图片类型必须是" + opts.imgType.join("，") + "中的一种");
                        this.value = "";
                        return false;
                    }

                    if (isIE && version < 10) {
                        
                        if (version == 6) {
                            
                            var image = new Image();
                            image.onload = function(){
                                if( (image.fileSize/1024) > opts.maxSize) {
                                    alert('图片大小不能超过'+opts.maxSize+'K');
                                    return false;
                                }
                            }
                            image.src = 'file:///' + this.value;

                            createImg().attr('src', image.src);
                            handle();
                        }  else {
                            
                            var img = document.selection.createRange().text || $(this).val();
                            var image = $('<img />')
                            image.load(function(){
                                if( (image.fileSize/1024) > opts.maxSize) {
                                    alert('图片大小不能超过'+opts.maxSize+'K');
                                    return false;
                                }
                            });
                            image.attr('src', img);                           
                            imgDiv.html('');           

                            image.css({ filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='"+img+"')" });
                            imgDiv.append(image);
                            setTimeout(handle, 100);                            
                        }
                    }
                    else {
                        var img;
                        try{   
                            var file = null;
                            var size = 0;
                            if(this.files && this.files[0] ){
                                file = this.files[0]; 
                                size = file.size;
                            }else if(this.files && this.files.item(0)) {                                
                                file = this.files.item(0);   
                                size = file.fileSize;
                            } 
 
                            if((size/1024) > opts.maxSize){
                                alert('图片大小不能超过'+opts.maxSize+'K');
                                return false;
                            }
                            
                            img = createImg();
                            
                            //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
                            try{
                                                          
                                img.attr('src', file.getAsDataURL());
                            }catch(e){                           
                                img.attr('src', window.URL.createObjectURL(file));
                            }
                            
                            img.css({ "vertical-align": "middle" });
                            setTimeout(handle, 100);
                        }catch(e){                          
                            //支持html5的浏览器
                            if (this.files && this.files[0]) {                          
                                if((this.files[0].size/1024) > opts.maxSize){
                                    alert('图片大小不能超过'+opts.maxSize+'K');
                                    return false;
                                }
                                
                                var reader = new FileReader(); 
                                reader.onload = function (e) {                                      
                                    imgDiv.attr('src', e.target.result);  
                                };
                                reader.readAsDataURL(this.files[0]); 
                                setTimeout(handle, 100);
                            }  
                        };
                    }
                }
            });
        }
    });
})(jQuery);

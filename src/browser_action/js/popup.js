if (typeof(advaniminit) == 'undefined') {
    advaniminit = true;


    var dd = document.domain.toLowerCase();

    if ((dd.indexOf('reddit') >= 0) || (dd.indexOf('lvme.me') >= 0) || ((typeof(want_advanimexto) != 'undefined') && want_advanimexto)) {
        want_advanimexto = false;
        if (typeof(advanimexto) == 'undefined') {
            advanimexto = {};


            advanimexto.log = '';
            advanimexto.test_output = '';

            advanimexto.submit_to_reddit = true; // default; if changed to false, will direct straight to generated meme



            advanimexto.addCss = function (cssCode) {
                var styleElement = document.createElement("style");
                document.getElementsByTagName("head")[0].appendChild(styleElement);
                styleElement.type = "text/css";
                if (styleElement.styleSheet) {
                    styleElement.styleSheet.cssText = cssCode;
                } else {
                    styleElement.appendChild(document.createTextNode(cssCode));
                }
            }

            advanimexto.addCss('@font-face {  font-family: Impact;  src: url("'+window.location.protocol+'//'+document.domain+'/Impact.ttf");  }');





            advanimexto.xhrqs = [];
            advanimexto.getData = function (u, f) {
                advanimexto.sendData(u, f, '');
            }
            advanimexto.postData = function (u, f, d) {
                advanimexto.sendData(u, f, d);
            }

            advanimexto.sendData = function (u, f, dat) {
                var xmlhttp;

                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                } else {
                    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                }

                var o = {};
                o.xmlhttp = xmlhttp;
                o.done = false;
                o.f = f;
                advanimexto.xhrqs.push(o);

                xmlhttp.onreadystatechange = function () {
                    var o = null;
                    for (var i = advanimexto.xhrqs.length-1; i>=0; i--) {
                        if (advanimexto.xhrqs[i].xmlhttp == this) {
                            o = advanimexto.xhrqs[i];
                            break;
                        }
                    }
                    if (o != null) {
                        if (this.readyState == 4 ) {
                            if (!o.done) {
                                o.done = true;
                                if (this.status == 200) {
                                    o.f(this.responseText, 'success');
                                } else {
                                    o.f('', 'error');
                                }
                            }
                        }
                    }
                }

                if (dat.length == 0) {
                    xmlhttp.open('GET', u, true);
                    xmlhttp.send();
                } else {
                    xmlhttp.open('POST', u, true);
                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xmlhttp.send(dat);
                }
            }



            advanimexto.gilh = function (sz) { // get impact line height
                var temp = document.createElement('div');
                temp.setAttribute("style","margin:0px;padding:0px;width:1024px;font-family:Impact;font-size:"+sz+'px;');
                temp.innerHTML = "test";
                document.body.appendChild(temp);
                var h1 = temp.clientHeight;
                document.body.removeChild(temp);

                var temp = document.createElement('div');
                temp.setAttribute("style","margin:0px;padding:0px;width:1024px;font-family:Impact;font-size:"+sz+'px;');
                temp.innerHTML = "test<BR>test";
                document.body.appendChild(temp);
                var h2 = temp.clientHeight;
                document.body.removeChild(temp);

                return (h2 - h1);
            }

            advanimexto.wrtx = function (ctx, text, x, y, maxWidth, maxHeight, initialTextSize, bottom) { // wrapText
                var ctxsz = initialTextSize + 6;
                var words = text.split(' ');
                for (var i = words.length-1; i>=0; i--) {
                    if (words[i].length == 0) {
                        words.splice(i, 1);
                    }
                }
                var line = '';
                var lz = [];
                var flz = [];
                var flh;
                var lineHeight;
                var good = false;
                var tx,ty;
                for (var qq = 0; qq<50; qq++) {
                    lz = [];
                    lineHeight = advanimexto.gilh(ctxsz);
                    ctx.font = ctxsz+'px Impact';
                    line = '';
                    tx = x;
                    ty = y;
                    for (var n = 0; n < words.length; n++) {
                        var maybeNextLine;
                        if (line.length == 0) {
                            maybeNextLine = words[n];
                        } else {
                            maybeNextLine = line + ' ' + words[n];
                        }
                        var metrics = ctx.measureText(maybeNextLine);
                        var testWidth = metrics.width;
                        if ((testWidth > maxWidth) && (n > 0)) {
                            lz.push({l:line, x:tx, y:ty});
                            line = words[n];
                            ty += lineHeight;
                        } else {
                            line = maybeNextLine;
                        }
                    }
                    lz.push({l:line, x:tx, y:ty});
                    if (qq == 0) {
                        flz = lz;
                        flh = lineHeight;
                    }
                    if ((lz.length * lineHeight) <= maxHeight) { // good
                        good = true;
                        break;
                    }
                    if (ctxsz < 8) {
                        break;
                    }
                    ctxsz--;
                }
                if (!good) {
                    lz = flz;
                    lineHeight = flh;
                }
                var ptz = [];
                shsz = 3 + Math.round(lineHeight/29);
                var d;
                for (var xx = -shsz; xx <= shsz; xx+=.5) {
                    for (var yy = -shsz; yy <= shsz; yy+=.5) {
                        d = Math.sqrt(xx*xx + yy*yy);
                        if (d <= shsz) {
                            if ((xx != 0) && (yy != 0)) {
                                ptz.push({xx:xx, yy:yy});
                            }
                        }
                    }
                }
                ptz.push({xx:0, yy:0});
                var ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; // firefox detection
                for (var i = 0; i<ptz.length; i++) {
                    var xx = ptz[i].xx;
                    var yy = ptz[i].yy;
                    ctx.save();
                    if ((xx == 0) && (yy == 0)) {
                        ctx.fillStyle = '#FFFFFF';
                    } else {
                        ctx.fillStyle = '#000000';
                    }
                    for (var n = 0; n<lz.length; n++) {
                        var o = lz[n];
                        var ofy = 0;
                        if (ff) { // "top" baseline works slightly differently in firefox, puts the text too high, so we adjust here
                            ofy += Math.round(lineHeight * .175);
                        }
                        if (bottom) {
                            ofy += (maxHeight - lineHeight*lz.length);
                        }
                        ctx.fillText(o.l, o.x + xx, o.y + yy + ofy);
                        /*
                         if ((xx == 0) && (yy == 0)) {
                         ctx.strokeStyle = '#000000';
                         ctx.strokeText(o.l, o.x, o.y);
                         }
                         */
                    }
                    ctx.restore();
                }
            }




            window.gotTemplateID = function (o) {
                advanimexto.furl = o.furl;
                var s = []; // the post data
                s.push('ht='+o.ht);
                s.push('k='+o.k);
                s.push('id='+o.id);

                var final_canvas = document.createElement('canvas');
                final_canvas.width = o.ww;
                final_canvas.height = o.hh;
                var tscx = o.ww/advanimexto.nw; // text scale x
                var tscy = o.hh/advanimexto.nh; // text scale y

                var tcib = Math.round(tscx*advanimexto.tcx)+","+Math.round(tscy*advanimexto.tcy)+","+Math.round(tscx*advanimexto.tcw)+","+Math.round(tscy*advanimexto.tch);
                var bcib = Math.round(tscx*advanimexto.bcx)+","+Math.round(tscy*advanimexto.bcy)+","+Math.round(tscx*advanimexto.bcw)+","+Math.round(tscy*advanimexto.bch);
                advanimexto.final_tcib = tcib;
                advanimexto.final_bcib = bcib;

                s.push('tci='+encodeURIComponent(advanimexto.final_tcib));
                s.push('bci='+encodeURIComponent(advanimexto.final_bcib));

                var tx = advanimexto.t_c.split(String.fromCharCode(13, 10)).join(' ');
                tx = tx.split(String.fromCharCode(13)).join(' ');
                tx = tx.split(String.fromCharCode(10)).join(' ');
                advanimexto.t_c = tx;

                var tx = advanimexto.b_c.split(String.fromCharCode(13, 10)).join(' ');
                tx = tx.split(String.fromCharCode(13)).join(' ');
                tx = tx.split(String.fromCharCode(10)).join(' ');
                advanimexto.b_c = tx;

                s.push('tc='+encodeURIComponent(advanimexto.t_c));
                s.push('bc='+encodeURIComponent(advanimexto.b_c));

                var ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; // firefox detection

                var ctx = final_canvas.getContext('2d');
                try {
                    ctx.drawImage(advanimexto.ndci, 0, 0, advanimexto.ow, advanimexto.oh, 0, 0, o.ww, o.hh);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    var xx = Math.round(tscx * (advanimexto.tcx + advanimexto.tcw/2) );
                    var yy = Math.round(tscy * (advanimexto.tcy));
                    advanimexto.wrtx(ctx, advanimexto.t_c, xx, yy, Math.round((advanimexto.tcw + 0) * tscx), Math.max(32, Math.round((advanimexto.tch - 5) * tscy)), Math.floor(advanimexto.tsz * (tscx + tscy)*.5 - 1), false);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    var xx = Math.round(tscx * (advanimexto.bcx + advanimexto.bcw/2) );
                    var yy = Math.round(tscy * (advanimexto.bcy));
                    advanimexto.wrtx(ctx, advanimexto.b_c, xx, yy, Math.round((advanimexto.bcw + 0) * tscx), Math.max(32, Math.round((advanimexto.bch - 5) * tscy)), Math.floor(advanimexto.bsz * (tscx + tscy)*.5 - 1), true);

                    //ctx.fillText(advanimexto.t_c, xx, yy);
                } catch (e) {
                    if (typeof(console) != 'undefined') {
                        if (typeof(console.log) != 'undefined') {
                            console.log('wtf '+advanimexto.ndci+'    '+e);
                        }
                    }
                }

                var pdat = final_canvas.toDataURL("image/jpeg", .9);
                pdat = pdat.split('base64,');
                if (pdat.length == 2) {
                    pdat = pdat[1];
                } else { // there was an error
                    return;
                }

                s.push('dat='+encodeURIComponent(pdat));

                if (localStorage) {
                    if (!localStorage.tempid) {
                        var tid = '';
                        var chz = '0123456789abcdefghijklmnopqrstuvwxyz';
                        for (var i = 0; i<32; i++) {
                            tid += chz.charCodeAt(Math.floor(Math.random()*chz.length));
                        }
                        localStorage.tempid = tid;
                    }
                    s.push('tid='+localStorage.tempid);
                }

                if ((''+advanimexto.dank) == '1') {
                    s.push('dank=1');
                }

                //The correct template data is already in place from the initial 3113_k call, so you don't actually need to supply modified template data when you implement the receiver for these vars. The 'w' mode isn't necessary
                s = s.join('&');

                //$.ajax({type: 'POST', url: 'http://'+document.domain+'/makememe64.php', data: s, success: function (e) { advanimexto.gotMemeURL(advanimexto.furl); }});
                advanimexto.postData(window.location.protocol+'//'+document.domain+'/makememe64.php', function (e) { advanimexto.gotMemeURL(advanimexto.furl); }, s);
            }




            advanimexto.hexed = function (s) {
                var fs = '';
                var ts;
                for (var i = 0; i<s.length; i++) {
                    var v = s.charCodeAt(i);
                    if (v < 0) v = 0;
                    if (v > 0xff) v = 0xff;
                    ts += '00'+((v).toString(16));
                    fs += ts.substr(ts.length - 2);
                }
                return fs;
            }


            advanimexto.b36b2i = function (s) {
                var v = 0;
                for (var i = 0; i<s.length; i++) {
                    var ch = s.charCodeAt(i);
                    if (ch>=0x61 && ch<=0x7a) {
                        v = (v*36) + ch + 10-0x61;
                    } else if (ch>=0x41 && ch<=0x5a) {
                        v = (v*36) + ch + 10-0x41;
                    } else if (ch>=0x30 && ch<=0x39) {
                        v = (v*36) + ch - 0x30;
                    }
                }
                return v;
            }


            advanimexto.b36i2b = function (a) {
                if (a == 0) {
                    return "0";
                }
                var s = "";
                var j = 8;
                var v;
                while (a > 0 && j > 0) {
                    v = a%36;
                    j--;
                    if (v <= 9) {
                        s = String.fromCharCode(0x30 + v) + s;
                    } else {
                        s = String.fromCharCode(0x61 + v - 10) + s;
                    }
                    a -= v;
                    a /= 36;
                }
                return s;
            }


            advanimexto.ec = function (tots) {
                var s = '';
                var hs = 'aepozxlugkistvyn';
                var fs = 'bcdfhjmqrw';
                var v;
                var k = 3 + Math.floor(Math.random()*12);
                s = hs.charAt(k);
                for (var i = 0; i<tots.length; i++) {
                    v = (tots.charCodeAt(i) + i*2 + k) % 256;
                    var v1 = Math.floor(v/16);
                    s += hs.charAt(v1);
                    v -= v1*16;
                    s += hs.charAt(v);
                    if (Math.random() < .5) {
                        s += fs.charAt(Math.floor(Math.random()*fs.length));
                    }
                }
                s += hs.charAt(Math.floor(Math.random()*hs.length));
                return s;
            }



            advanimexto.getSidAndId = function (olink) {
                var uz = olink.split('/');
                var luz = olink.toLowerCase().split('/');
                var sid = 0;
                var id = 0;
                var mu;
                var good;
                var can_look = false;
                var hus = false; // has underscore
                var hie = false; // has image extension
                var whtm = false; // was main html site rather than a mirror
                var msid = 1; // maybe sid
                for (var q = 0; q<uz.length; q++) {
                    mu = uz[q];
                    lmu = luz[q];
                    if ((!can_look) && (lmu.indexOf('livememe.com') >= 0)) {
                        can_look = true;
                        if ((lmu.indexOf('livememe.com') == 0) || lmu.indexOf('www.') == 0) {
                            whtm = true;
                        }
                        lmu = lmu.split('.');
                        if (lmu[0].substr(0,1) == 'i') {
                            lmu = lmu[0].substr(1);
                            if ((""+(lmu + 0)) == lmu) {
                                msid = lmu + 0;
                            }
                        }
                    } else {
                        if ((lmu.indexOf('.jpg') >= 0) || (lmu.indexOf('.gif') >= 0) || (lmu.indexOf('.png') >= 0)) {
                            hie = true;
                            mu = mu.split('_');
                            if (mu.length > 1) {
                                hus = true;
                            }
                            mu = mu[mu.length-1]; // in case it's a mirror link
                            mu = mu.split('.');
                            mu = mu[0]; // get rid of the extension, we're just the ID now
                        }
                        good = false;
                        if (mu.length > 0) {
                            good = true;
                            for (var p=0; p<mu.length; p++) {
                                var v = mu.charCodeAt(p);
                                if ((v>=0x30 && v<=0x39) || (v>=0x61 && v<=0x7a)) {

                                } else {
                                    good = false;
                                    break;
                                }
                            }
                        }
                        if (good) {
                            if (hus || (!hie) || whtm) {
                                var v = advanimexto.b36b2i(mu);
                                sid = v%32;
                                v -= sid;
                                v /= 32;
                                id = Math.round(v);
                                return {id: id, sid: sid};
                            } else {
                                return {id: advanimexto.b36b2i(mu), sid: msid, hus:hus, hie:hie};
                            }
                        }
                    }
                }
                return {id: 1, sid: 1};
            }


            advanimexto.getImgURL = function (olink) {
                if (olink.indexOf('livememe.com') >= 0) {
                    var ido = advanimexto.getSidAndId(olink);
                    return window.location.protocol+"//"+document.domain+"/"+advanimexto.b36i2b(ido.id)+"_abg.jpg";
                    //return "http://b1.livememe.com/0/0/"+escape(olink);
                }
            }


            advanimexto.getNameGrabURL = function (olink) {
                if (olink.indexOf('livememe.com') >= 0) {
                    var ido = advanimexto.getSidAndId(olink);
                    return "https://www.livememe.com/shim_j1_3113.php?u=n0_"+advanimexto.b36i2b(ido.id);
                }
            }


            advanimexto.last_swf_ready_val = -1;
            function advanimswfReady (srv) {
                if (advanimexto.last_swf_ready_val != srv) {
                    advanimexto.last_swf_ready_val = srv;
                    advanimLog("hehe");
                    var swf = document.getElementById('advanimaker');
                    if (swf) {
                        swf.gotReadyConfirmation(srv);

                        swf.setTopCaption(escape(advanimexto.t_c));
                        swf.setBottomCaption(escape(advanimexto.b_c));

                        var olink = advanimexto.olink;

                        if (olink.indexOf('livememe.com') >= 0) {
                            var ido = advanimexto.getSidAndId(olink);
                            var o = document.createElement('script');
                            o.src = "https://www.livememe.com/shim_j1_3113.php?u=n2_"+advanimexto.b36i2b(ido.id);
                            document.body.appendChild(o);
                        } else {
                            swf.setImage(advanimexto.getImgURL(advanimexto.olink), 0, 0);
                        }

                        if (advanimexto.dank) {
                            swf.setDank(advanimexto.dank);
                        }
                    }
                    var div = document.getElementById('advanimakerdiv');
                    if (div) {
                        div.style.visibility = 'hidden';
                        div.style.visibility = 'visible'; // this hide/show cycle is needed for chrome for some reason
                    }
                }
            }

            function advanimswfTesturl (u) {
                advanimexto.test_output += " "+u;
            }

            function advanimLog (d) {
                advanimexto.log += " "+d;
            }


            function advanimswfSetsize (nw, nh, ow, oh) {
                advanimLog("a");
                advanimexto.nw = nw;
                advanimexto.nh = nh;
                advanimexto.ow = ow;
                advanimexto.oh = oh;
                advanimexto.sizeWasSet();
                var div = document.getElementById('advanimakerdiv');
                if (div) {
                    div.style.width = nw+'px';
                    div.style.height = nh+'px';
                }
                advanimLog("b");
                advanimexto.showInputs();
                advanimLog("c");
                advanimexto.test_setsize = Math.random();
            }




            advanimexto.sizeWasSet = function () {
                advanimexto.sizeset = true;
                if (typeof(advanimexto.thi_b) != 'undefined') {
                    var ii = document.createElement('img');
                    advanimexto.thi_ii = ii;
                    ii.src = "http://aae.livememe.com/set_thi_height"+Math.random()+"?d=/"+advanimexto.thi_b+"-"+advanimexto.nh;
                }
            }


            function advanimswfMemeDone (u) {
                advanimexto.gotMemeURL(u+".jpg");
            }


            advanimexto.toURLvar = function (v) {
                return encodeURI((""+v).split("\\").join("\\\\").split("/").join("\\-")).split("#").join("%23");
            }




            advanimexto.olink = '';

            if (false && window.advanim_flash_works) {
                advanimexto.html5 = false;
            } else {
                advanimexto.html5 = true;
            }
            advanimexto.has_more_options = !advanimexto.html5;

            advanimexto.capt_str = 'caption';
            advanimexto.nw = 450;
            advanimexto.nh = 450;

            advanimexto.bch = 64;
            advanimexto.tch = 64;

            advanimexto.bcx = 0;
            advanimexto.bcy = 0;

            advanimexto.tcx = 0;
            advanimexto.tcy = 0;

            advanimexto.t_c = '';
            advanimexto.b_c = '';

            advanimexto.orig_name = '';
            advanimexto.orig_bg_img = ''; // if set to url fragment, this is the image we use from another site. if set to 'livememe:sid:tid:tdat', we load editorswf instead and save under this album id

            advanimexto.ofx = 8;
            advanimexto.ofy = 27;

            advanimexto.vis = false;

            //  advanimexto.gogogo = function () {
            //    advanimexto.did_init = true;
            advanimexto.mdms = ["livememe.com"];

            advanimexto.username = '';
            advanimexto.logged_in = true; // if not logged in, then we don't add "captions" link to anything
            var os = document.getElementsByTagName("span");
            for (var i = os.length-1; i>=0; i--) {
                var o = os[i];
                if (o.className == "user") {
                    var os2 = o.childNodes;
                    for (var j = os2.length-1; j>=0; j--) {
                        o2 = os2[j];
                        if (typeof(o2.tagName) != 'undefined') {
                            if (o2.tagName.toLowerCase()=='a') {
                                if (o2.href.indexOf('reddit.com/user') >= 0) {
                                    var unps = o2.href.split('/');
                                    advanimexto.username = unps[unps.length - 2];
                                }
                            }
                            if ((o2.className=="login-required") && (o2.tagName.toLowerCase()=="a") && (o2.innerHTML.indexOf("register") >= 0)) {
                                advanimexto.logged_in = false;
                                break;
                            }
                        }
                    }
                }
            }
            if (advanimexto.logged_in && (advanimexto.username != '')) {
                var o = document.createElement('script');
                o.src = "http://aae.livememe.com/advice_animals_chat"+Math.random()+"?d=/"+advanimexto.ec(advanimexto.username)+"/";
                document.body.appendChild(o); // AdviceAnimals chat not yet implemented
            }

            advanimexto.ndc = null;
            advanimexto.ndcp = null;
            advanimexto.ndci = null;
            advanimexto.canvas = null;

            advanimexto.cd = document.createElement("div");
            advanimexto.cd.style.position = 'relative';
            advanimexto.cd.style.width = '600px';
            advanimexto.cd.style.height = '500px';
            advanimexto.cd.style['font-family'] = advanimexto.cd.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
            advanimexto.ldg = document.createElement("div");
            advanimexto.ldg.style.visibility = "hidden";
            var tn = document.createTextNode("Loading...");
            advanimexto.ldg.appendChild(tn);
            advanimexto.cd.appendChild(advanimexto.ldg);

            advanimexto.puffwar = document.createElement('div');
            advanimexto.puffwar.style.zIndex = 0x7ffffff2;
            advanimexto.puffwar.style.position = 'absolute';
            advanimexto.puffwar.style.left = '482px';
            advanimexto.puffwar.style.top = '309px';
            advanimexto.puffwar.style.width = '259px';
            advanimexto.puffwar.style.height = '93px';
            advanimexto.puffwar.style.color = '#A00000';
            advanimexto.puffwar.style.fontWeight = 'bold';
            advanimexto.puffwar.style.display = 'none';
            advanimexto.puffwar.style.textAlign = 'center';
            advanimexto.puffwar.innerHTML = 'The puffin has been banned from the AdviceAnimals subreddit. You can still create puffin memes on livememe, but do not post them to reddit because they will be removed! Sorry :(';
            advanimexto.cd.appendChild(advanimexto.puffwar);

            advanimexto.helptextdiv = document.createElement('div');
            advanimexto.helptextdiv.style.zIndex = 0x7ffffff3;
            advanimexto.helptextdiv.style.position = 'absolute';
            advanimexto.helptextdiv.style.left = '482px';
            advanimexto.helptextdiv.style.top = '309px';
            advanimexto.helptextdiv.style.width = '259px';
            advanimexto.helptextdiv.style.height = '93px';
            advanimexto.helptextdiv.style.color = '#000040';
            advanimexto.helptextdiv.style.fontWeight = 'bold';
            advanimexto.helptextdiv.style.display = 'none';
            advanimexto.helptextdiv.style.textAlign = 'center';
            advanimexto.helptextdiv.innerHTML = '';
            advanimexto.cd.appendChild(advanimexto.helptextdiv);

            advanimexto.holda = document.createElement("div");
            advanimexto.holda.style.zIndex = 0x7ffffff1;
            advanimexto.holda.style.position = 'absolute';
            advanimexto.holda.style.overflow = 'hidden';
            advanimexto.holda.style.left = '0px';
            advanimexto.holda.style.top = '0px';
            advanimexto.cd.appendChild(advanimexto.holda);

            advanimexto.cover = document.createElement("div");
            advanimexto.cover.style.zIndex = 0x7fffffff;
            advanimexto.cover.style.position = 'absolute';
            advanimexto.cover.style.left = '0px';
            advanimexto.cover.style.top = '0px';
            advanimexto.cd.appendChild(advanimexto.cover);



            advanimexto.drag_mode = -1;


            advanimexto.cover.onmousemove = function (e) {
                if (advanimexto.vis) {
                    var xm, ym;

                    if(e.offsetX) {
                        xm = e.offsetX;
                        ym = e.offsetY;
                    }
                    else if(e.layerX) {
                        xm = e.layerX;
                        ym = e.layerY;
                    }


                    if (advanimexto.drag_mode == -1) {

                        var cs = 'default';

                        if ((xm >= (advanimexto.tcx)) && (ym >= (advanimexto.tcy)) && (xm <= (advanimexto.tcx + advanimexto.tcw)) && (ym <= (advanimexto.tcy + advanimexto.tch))) {
                            advanimexto.t_cap.style.visibility = 'visible';
                            if ((xm >= (advanimexto.tcx + advanimexto.tcw - 16)) && (ym >= (advanimexto.tcy + advanimexto.tch - 16))) {
                                cs = 'nw-resize';
                            } else {
                                cs = 'move';
                            }
                        } else {
                            advanimexto.t_cap.style.visibility = 'hidden';
                        }
                        if ((xm >= (advanimexto.bcx)) && (ym >= (advanimexto.bcy)) && (xm <= (advanimexto.bcx + advanimexto.bcw)) && (ym <= (advanimexto.bcy + advanimexto.bch))) {
                            advanimexto.b_cap.style.visibility = 'visible';
                            if ((xm >= (advanimexto.bcx + advanimexto.bcw - 16)) && (ym >= (advanimexto.bcy + advanimexto.bch - 16))) {
                                cs = 'nw-resize';
                            } else {
                                cs = 'move';
                            }
                        } else {
                            advanimexto.b_cap.style.visibility = 'hidden';
                        }
                        this.style.cursor = cs;
                    } else if (advanimexto.drag_mode == 0) {
                        advanimexto.tcx = advanimexto.dsx + xm - advanimexto.sxm;
                        advanimexto.tcy = advanimexto.dsy + ym - advanimexto.sym;
                        advanimexto.redraw(0);
                    } else if (advanimexto.drag_mode == 1) {
                        advanimexto.bcx = advanimexto.dsx + xm - advanimexto.sxm;
                        advanimexto.bcy = advanimexto.dsy + ym - advanimexto.sym;
                        advanimexto.redraw(1);
                    } else if (advanimexto.drag_mode == 2) {
                        advanimexto.tcw = Math.max(32, advanimexto.dsw + xm - advanimexto.sxm);
                        advanimexto.tch = Math.max(32, advanimexto.dsh + ym - advanimexto.sym);
                        advanimexto.redraw(0);
                        advanimexto.setCaption(0, advanimexto.t_c);
                        advanimexto.redraw(0);
                    } else if (advanimexto.drag_mode == 3) {
                        advanimexto.bcw = Math.max(32, advanimexto.dsw + xm - advanimexto.sxm);
                        advanimexto.bch = Math.max(32, advanimexto.dsh + ym - advanimexto.sym);
                        advanimexto.redraw(1);
                        advanimexto.setCaption(1, advanimexto.b_c);
                        advanimexto.redraw(1);
                    }
                }
            }

            advanimexto.cover.onmouseout = function (e) {
                advanimexto.drag_mode = -1;
                this.onmousemove(e);
            }



            advanimexto.cover.onmouseup = function (e) {
                advanimexto.drag_mode = -1;
                this.onmousemove(e);
            }



            advanimexto.cover.onmousedown = function (e) {
                var xm, ym;

                if(e.offsetX) {
                    xm = e.offsetX;
                    ym = e.offsetY;
                }
                else if(e.layerX) {
                    xm = e.layerX;
                    ym = e.layerY;
                }

                var cs = 'default';


                advanimexto.sxm = xm;
                advanimexto.sym = ym;

                if ((xm >= (advanimexto.tcx)) && (ym >= (advanimexto.tcy)) && (xm <= (advanimexto.tcx + advanimexto.tcw)) && (ym <= (advanimexto.tcy + advanimexto.tch))) {
                    advanimexto.dsx = advanimexto.tcx;
                    advanimexto.dsy = advanimexto.tcy;
                    advanimexto.dsw = advanimexto.tcw;
                    advanimexto.dsh = advanimexto.tch;
                    if ((xm >= (advanimexto.tcx + advanimexto.tcw - 16)) && (ym >= (advanimexto.tcy + advanimexto.tch - 16))) {
                        cs = 'nw-resize';
                        advanimexto.drag_mode = 2;
                    } else {
                        cs = 'move';
                        advanimexto.drag_mode = 0;
                    }
                }
                if ((xm >= (advanimexto.bcx)) && (ym >= (advanimexto.bcy)) && (xm <= (advanimexto.bcx + advanimexto.bcw)) && (ym <= (advanimexto.bcy + advanimexto.bch))) {
                    advanimexto.dsx = advanimexto.bcx;
                    advanimexto.dsy = advanimexto.bcy;
                    advanimexto.dsw = advanimexto.bcw;
                    advanimexto.dsh = advanimexto.bch;
                    if ((xm >= (advanimexto.bcx + advanimexto.bcw - 16)) && (ym >= (advanimexto.bcy + advanimexto.bch - 16))) {
                        cs = 'nw-resize';
                        advanimexto.drag_mode = 3;
                    } else {
                        cs = 'move';
                        advanimexto.drag_mode = 1;
                    }
                }
                this.style.cursor = cs;
                this.onmousemove(e);
            }






            var t_cap = document.createElement('div');
            t_cap.style['z-index'] = t_cap.style.zIndex = 0x7fffff00;
            t_cap.style.background = '#000000';
            t_cap.style.border = '1px solid #ffffff';
            t_cap.style.opacity = 0.35;
            t_cap.style.width = '256px';
            t_cap.style.height = '40px';
            t_cap.style.position = 'absolute';
            t_cap.style.left = '16px';
            t_cap.style.top = '32px';
            t_cap.style.visibility = 'hidden';
            advanimexto.t_cap = t_cap;
            advanimexto.holda.appendChild(t_cap);


            var b_cap = document.createElement('div');
            b_cap.style['z-index'] = b_cap.style.zIndex = 0x7fffff00;
            b_cap.style.background = '#000000';
            b_cap.style.border = '1px solid #ffffff';
            b_cap.style.opacity = 0.35;
            b_cap.style.width = '200px';
            b_cap.style.height = '40px';
            b_cap.style.position = 'absolute';
            b_cap.style.left = '16px';
            b_cap.style.top = '132px';
            b_cap.style.visibility = 'hidden';
            advanimexto.b_cap = b_cap;
            advanimexto.holda.appendChild(b_cap);







            var tcts = [];
            for (var q = 0; q<=10; q++) {
                var tct = document.createElement("div");
                tct.style.position = 'absolute';
                tct.style.visibility = 'hidden';
                tct.style['text-align'] = tct.style.textAlign = 'center';
                tct.style['font-family'] = tct.style.fontFamily = 'Impact';
                tct.style['font-size'] = tct.style.fontSize = '32px';
                if (q == 0) {
                    tct.style.color = '#ffffff';
                    tct.style['z-index'] = tct.style.zIndex = 0x7fffff31;
                } else {
                    tct.style.color = '#000000';
                    tct.style['z-index'] = tct.style.zIndex = 0x7fffff30;
                }
                tct.style['-khtml-user-select'] = tct.style.MozUserSelect = 'none';
                tct.style['word-wrap'] = tct.style.wordWrap = 'break-word';
                tcts.push(tct);
                advanimexto.holda.appendChild(tct);
            }

            advanimexto.tcts = tcts;



            var bcts = [];
            for (var q = 0; q<=10; q++) {
                var bct = document.createElement("div");
                bct.style.position = 'absolute';
                bct.style.visibility = 'hidden';
                bct.style['text-align'] = bct.style.textAlign = 'center';
                bct.style['font-family'] = bct.style.fontFamily = 'Impact';
                bct.style['font-size'] = bct.style.fontSize = '32px';
                if (q == 0) {
                    bct.style.color = '#ffffff';
                    bct.style['z-index'] = bct.style.zIndex = 0x7fffff31;
                } else {
                    bct.style.color = '#000000';
                    bct.style['z-index'] = bct.style.zIndex = 0x7fffff30;
                }
                bct.style['-khtml-user-select'] = bct.style.MozUserSelect = 'none';
                bct.style['word-wrap'] = bct.style.wordWrap = 'break-word';
                bcts.push(bct);
                advanimexto.holda.appendChild(bct);
            }

            advanimexto.bcts = bcts;






            var rstcd = document.createElement("div");
            var tn = document.createTextNode("reddit submission title");
            rstcd.appendChild(tn);
            rstcd.style.position = 'absolute';
            rstcd.style.visibility = 'hidden';
            rstcd.style.width = '256px';
            rstcd.style.height = '24px';
            rstcd.style['text-align'] = rstcd.style.textAlign = 'center';
            advanimexto.rstcd = rstcd;
            advanimexto.cd.appendChild(rstcd);

            var rstci = document.createElement("textarea");
            rstci.style.position = 'absolute';
            rstci.style.visibility = 'hidden';
            rstci.style.width = '256px';
            rstci.style.height = '40px';
            advanimexto.rstci = rstci;
            advanimexto.cd.appendChild(rstci);






            var tccd = document.createElement("div");
            var tn = document.createTextNode("top caption");
            tccd.appendChild(tn);
            tccd.style.position = 'absolute';
            tccd.style.visibility = 'hidden';
            tccd.style.width = '256px';
            tccd.style.height = '24px';
            tccd.style['text-align'] = tccd.style.textAlign = 'center';
            advanimexto.tccd = tccd;
            advanimexto.cd.appendChild(tccd);



            var tci = document.createElement("textarea");
            tci.style.position = 'absolute';
            tci.style.visibility = 'hidden';
            tci.style.width = '256px';
            tci.style.height = '60px';
            tci.style['font-family'] = tci.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
            advanimexto.tci = tci;
            advanimexto.cd.appendChild(tci);
            tci.onchange = tci.onkeydown = tci.onkeyup = function () {
                advanimexto.setCaption(0, this.value);
            }





            var bccd = document.createElement("div");
            var tn = document.createTextNode("bottom caption");
            bccd.appendChild(tn);
            bccd.style.position = 'absolute';
            bccd.style.visibility = 'hidden';
            bccd.style.width = '256px';
            bccd.style.height = '24px';
            bccd.style['text-align'] = bccd.style.textAlign = 'center';
            advanimexto.bccd = bccd;
            advanimexto.cd.appendChild(bccd);



            var bci = document.createElement("textarea");
            bci.style.position = 'absolute';
            bci.style.visibility = 'hidden';
            bci.style.width = '256px';
            bci.style.height = '60px';
            bci.style['font-family'] = bci.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
            advanimexto.bci = bci;
            advanimexto.cd.appendChild(bci);
            bci.onchange = bci.onkeydown = bci.onkeyup = function () {
                advanimexto.setCaption(1, this.value);
            }

            var subbtn = document.createElement('div');
            subbtn.style.background = 'url("http://static.livememe.com/generate2.png")';
            subbtn.style.position = 'absolute';
            subbtn.style.visibility = 'hidden';
            subbtn.style.width = '89px';
            subbtn.style.height = '31px';
            subbtn.style.cursor = 'pointer';
            advanimexto.subbtn = subbtn;
            advanimexto.cd.appendChild(subbtn);
            advanimexto.sub_mo = false;
            subbtn.onmouseover = function () {
                if (!advanimexto.subbtn_disabled) {
                    advanimexto.sub_mo = true;
                    advanimexto.subbtn.style.backgroundPosition = '0px -31px';
                }
            }
            subbtn.onmouseout = function () {
                if (!advanimexto.subbtn_disabled) {
                    advanimexto.sub_mo = false;
                    advanimexto.subbtn.style.backgroundPosition = '0px 0px';
                }
            }
            subbtn.onmousedown = function () {
                if (!advanimexto.subbtn_disabled) {
                    advanimexto.sub_md = true;
                    advanimexto.subbtn.style.backgroundPosition = '0px -62px';
                }
            }
            subbtn.onmouseup = function () {
                if (!advanimexto.subbtn_disabled) {
                    advanimexto.sub_md = false;
                    advanimexto.subbtn.style.backgroundPosition = '0px 0px';
                }
            }
            subbtn.onclick = function () {
                if (advanimexto.subbtn_disabled) {
                    return;
                }
                var o = document.createElement('script');

                var ts = Math.round(advanimexto.tcx)+","+Math.round(advanimexto.tcy)+","+Math.round(advanimexto.tcw)+","+Math.round(advanimexto.tch);
                var bs = Math.round(advanimexto.bcx)+","+Math.round(advanimexto.bcy)+","+Math.round(advanimexto.bcw)+","+Math.round(advanimexto.bch);
                var osc = Math.round(advanimexto.sc * 1000000);
                var oww = Math.round(advanimexto.ow);
                var ohh = Math.round(advanimexto.oh);
                var noscr = false;
                var tid = '';
                if (advanimexto.html5) {
                    if (advanimexto.orig_bg_img.indexOf('livememe:') >= 0) {
                        var ido = advanimexto.getSidAndId(advanimexto.olink);
                        var o = document.createElement('script');
                        o.src = "https://www.livememe.com/shim_j1_3113.php?u=k"+advanimexto.b36i2b(ido.id)+"_"+advanimexto.hexed(advanimexto.t_c)+"_"+advanimexto.hexed(advanimexto.b_c);
                        document.body.appendChild(o);
                    }
                } else {
                    if (advanimexto.orig_bg_img.indexOf('livememe:') >= 0) {
                        noscr = true;
                    }
                    var swf = document.getElementById('advanimaker');
                    if (swf) {
                        swf.setName(escape(advanimexto.orig_name));
                        swf.setOrigImg(advanimexto.orig_bg_img); // name is "livememe:sid:tid:tdat" if we were a livememe
                        swf.save(tid);
                    }
                }

                var lg = document.createElement('div');
                advanimexto.lg = lg;
                lg.style.background = 'url(http://static.livememe.com/load.gif)';
                lg.style.width = '40px';
                lg.style.height = '40px';
                lg.style.position = 'absolute';


                var ltdiv = document.createElement('div');
                ltdiv.style.position = 'absolute';
                ltdiv.style['text-align'] = ltdiv.style.textAlign = 'center';
                ltdiv.style.width = '120px';
                ltdiv.style.height = '120px';
                ltdiv.style.left = Math.floor(advanimexto.ofx + advanimexto.nw+16 + (256/2) + 100 - (120/2))+'px';


                var radiodiv = document.getElementById('advanimradiodiv');
                if (radiodiv) {
                    lg.style.left = Math.floor(advanimexto.ofx + advanimexto.nw+16 + 196)+'px';
                    lg.style.top = (advanimexto.ofy + 270)+'px';
                    ltdiv.style.left = Math.floor(advanimexto.ofx + advanimexto.nw+16 + 156)+'px';
                    ltdiv.style.top = (advanimexto.ofy + 312)+'px';
                } else {
                    lg.style.left = Math.floor(advanimexto.ofx + advanimexto.nw+16 + (256/2) + 100 - (40/2))+'px';
                    lg.style.top = (advanimexto.ofy + 220)+'px';
                    ltdiv.style.left = Math.floor(advanimexto.ofx + advanimexto.nw+16 + (256/2) + 100 - (120/2))+'px';
                    ltdiv.style.top = (advanimexto.ofy + 262)+'px';
                }
                var lttxt = document.createTextNode('uploading...');
                ltdiv.appendChild(lttxt);
                advanimexto.ustm = new Date().getTime();
                advanimexto.ltdiv = ltdiv;
                advanimexto.lttxt = lttxt;

                advanimexto.cd.appendChild(lg);
                advanimexto.cd.appendChild(ltdiv);

                advanimexto.rstci.disabled = true;
                advanimexto.tci.disabled = true;
                advanimexto.bci.disabled = true;

                if (!noscr) {
                    document.body.appendChild(o);
                }
                advanimexto.subbtn.style.backgroundPosition = '0px -93px';
                advanimexto.subbtn.style.cursor = 'auto';
                advanimexto.subbtn_disabled = true;
                advanimexto.mopbtn.style.backgroundPosition = '0px -93px';
                advanimexto.mopbtn.style.cursor = 'auto';
                advanimexto.mopbtn_disabled = true;
            }






            var mopbtn = document.createElement('div');
            advanimexto.mopbtn = mopbtn;



            if (typeof(advanimexto_radio_d) != 'undefined') {
                if (advanimexto.has_more_options) {
                    mopbtn.style.background = 'url("http://static.livememe.com/moreoptions.png")';
                    mopbtn.style.position = 'absolute';
                    mopbtn.style.visibility = 'hidden';
                    mopbtn.style.width = '105px';
                    mopbtn.style.height = '31px';
                    mopbtn.style.cursor = 'pointer';
                    advanimexto.cd.appendChild(mopbtn);
                    advanimexto.mop_mo = false;
                    mopbtn.onmouseover = function () {
                        if (!advanimexto.mopbtn_disabled) {
                            advanimexto.mop_mo = true;
                            advanimexto.mopbtn.style.backgroundPosition = '0px -31px';
                        }
                    }
                    mopbtn.onmouseout = function () {
                        if (!advanimexto.mopbtn_disabled) {
                            advanimexto.mop_mo = false;
                            advanimexto.mopbtn.style.backgroundPosition = '0px 0px';
                        }
                    }
                    mopbtn.onmousedown = function () {
                        if (!advanimexto.mopbtn_disabled) {
                            advanimexto.mop_md = true;
                            advanimexto.mopbtn.style.backgroundPosition = '0px -62px';
                        }
                    }
                    mopbtn.onmouseup = function () {
                        if (!advanimexto.mopbtn_disabled) {
                            advanimexto.mop_md = false;
                            advanimexto.mopbtn.style.backgroundPosition = '0px 0px';
                        }
                    }
                    mopbtn.onclick = function () {
                        if (advanimexto.mopbtn_disabled) {
                            return;
                        }
                        var ido = advanimexto.getSidAndId(advanimexto.olink);
                        top.location.href = "http://www.livememe.com/edit?"+advanimexto.b36i2b(ido.id)+"_"+ido.sid;
                        advanimexto.mopbtn.style.backgroundPosition = '0px -93px';
                        advanimexto.mopbtn.style.cursor = 'auto';
                        advanimexto.mopbtn_disabled = true;
                    }
                }
            }






            advanimexto.showInputs = function () {

                var tccd = advanimexto.tccd;
                var bccd = advanimexto.bccd;

                var tci = advanimexto.tci;
                var bci = advanimexto.bci;

                var rstcd = advanimexto.rstcd;

                var rstci = advanimexto.rstci;


                var subbtn = advanimexto.subbtn;
                var mopbtn = advanimexto.mopbtn;

                var nw = advanimexto.nw;
                var nh = advanimexto.nh;

                tccd.style.left = (advanimexto.ofx + nw+16)+'px';
                tccd.style.top = (advanimexto.ofy + 0)+'px';

                tci.style.left = (advanimexto.ofx + nw+16)+'px';
                tci.style.top = (advanimexto.ofy + 16)+'px';



                bccd.style.left = (advanimexto.ofx + nw+16)+'px';
                bccd.style.top = (advanimexto.ofy + 100)+'px';

                bci.style.left = (advanimexto.ofx + nw+16)+'px';
                bci.style.top = (advanimexto.ofy + 116)+'px';


                //rstcd.style.left = (advanimexto.ofx + nw+16)+'px';
                //rstcd.style.top = (advanimexto.ofy + 0)+'px';

                //rstci.style.left = (advanimexto.ofx + nw+16)+'px';
                //rstci.style.top = (advanimexto.ofy + 16)+'px';


                var div = document.getElementById('advanimradiodiv');
                if (div) {
                    div.style.left = (advanimexto.ofx + nw+16)+'px';
                    div.style.top = (advanimexto.ofy + 196)+'px';
                    subbtn.style.left = Math.floor(advanimexto.ofx + nw+16 + 256 - 79)+'px';
                    mopbtn.style.left = Math.floor(advanimexto.ofx + nw+16 + 256 - 100)+'px';
                } else {
                    subbtn.style.left = Math.floor(advanimexto.ofx + nw+16 + (256/2) - (89/2))+'px';
                    mopbtn.style.left = Math.floor(advanimexto.ofx + nw+16 + (256/2) - (103/2))+'px';
                }
                subbtn.style.top = (advanimexto.ofy + 196)+'px';
                mopbtn.style.top = (advanimexto.ofy + 234)+'px';

                advanimexto.cd.style.height = Math.max(advanimexto.ofy+nh+40, advanimexto.ofy+361)+'px';
                advanimexto.ldg.style.visibility = "hidden";

                if (typeof(advanimexto.extraInputCallback) != 'undefined') {
                    advanimexto.extraInputCallback();
                }

                var shows = ('tccd,tci,bccd,bci,subbtn,mopbtn').split(','); // we hide rstcd and rstci now
                for (var q = shows.length-1; q>=0; q--) {
                    advanimexto[shows[q]].style.visibility = 'visible';
                }
                advanimexto.tci.focus();
            }




            advanimexto.adjustTextSize = function (st, ch) {
                st.style.height = 'auto';

                var v = 128;
                var j = 256;
                var k = 256;

                var vc = 0;
                while (true) {
                    st.style['font-size'] = st.style.fontSize = j+'px';

                    if (st.clientHeight > (ch-10)) { // too big
                        j = j-v;
                    } else { // not big enough?
                        k = j;
                        j = j+v;
                    }
                    v = v/2;
                    if (v <= 1) {
                        vc++;
                        if (vc >= 5) {
                            break;
                        }
                    }
                }

                if (k<12) {
                    k = 12;
                }
                if (k>127) {
                    k = 127;
                }
                return k;
            }






            advanimexto.reposBottomText = function () {
                var bcts = advanimexto.bcts;
                bcts[0].style.height = 'auto';
                var fofy = advanimexto.bch - bcts[0].clientHeight;
                advanimexto.fofy = fofy;
                for (var q = bcts.length-1; q>=0; q--) {
                    var bct = bcts[q];
                    bct.style.width = advanimexto.bcw+'px';
                    bct.style.height = advanimexto.bch+'px';
                    if (q == 0) {
                        var d = 0;
                    } else {
                        var d = 4;
                    }
                    bct.style.left = (advanimexto.bcx + Math.round(d*Math.cos((q/(bcts.length-1))*(2*Math.PI))) + 0)+'px';
                    bct.style.top = (advanimexto.bcy + fofy + Math.round(d*Math.sin((q/(bcts.length-1))*(2*Math.PI)))) + 'px';// + advanimexto.nh-advanimexto.bch)+'px';
                }
            }



            advanimexto.redraw = function (p) {
                var ch = '';
                if (p == 0) { // top caption
                    ch = 't';
                } else if (p == 1) {
                    ch = 'b';
                }

                var cap = this[ch+'_cap'];
                cap.style.width = this[ch+'cw']+'px';
                cap.style.height = this[ch+'ch']+'px';
                cap.style.left = (this[ch+'cx']) + 'px';
                cap.style.top = (this[ch+'cy']) + 'px';

                var cts = this[ch+'cts'];
                for (var q = cts.length-1; q>=0; q--) {
                    var ct = cts[q];
                    ct.style.width = this[ch+'cw']+'px';
                    ct.style.height = this[ch+'ch']+'px';
                    if (q == 0) {
                        var d = 0;
                    } else {
                        var d = 4;
                    }
                    ct.style.left = (this[ch+'cx'] + Math.round(d*Math.cos((q/(cts.length-1))*(2*Math.PI))))+'px';
                    ct.style.top = (this[ch+'cy'] + Math.round(d*Math.sin((q/(cts.length-1))*(2*Math.PI))))+'px';
                }
                if (p == 1) {
                    this.reposBottomText();
                }
            }



            advanimexto.setDank = function (d) { // 1 or 0
                advanimexto.dank = d;
                if (!advanimexto.html5) {
                    var swf = document.getElementById('advanimaker');
                    if (swf) {
                        try {
                            swf.setDank(d);
                        } catch (e) {

                        }
                    }
                }
            }



            advanimexto.setCaption = function (p, s) {
                var us = s.toUpperCase();
                var cts = [];
                var sz;
                if (p == 0) { // top caption
                    cts = advanimexto.tcts;
                    sz = advanimexto.tch;
                    advanimexto.t_c = us;
                    if (!advanimexto.html5) {
                        var swf = document.getElementById('advanimaker');
                        if (swf) {
                            swf.setTopCaption(escape(us));
                        }
                    }
                } else if (p == 1) {
                    cts = advanimexto.bcts;
                    sz = advanimexto.bch;
                    advanimexto.b_c = us;
                    if (!advanimexto.html5) {
                        var swf = document.getElementById('advanimaker');
                        if (swf) {
                            swf.setBottomCaption(escape(us));
                        }
                    }
                }
                for (var i = cts.length-1; i>=0; i--) {
                    var ct = cts[i];
                    if (typeof(ct.tn) != 'undefined') {
                        ct.removeChild(ct.tn);
                    }
                    var tn = document.createTextNode(us);
                    ct.tn = tn;
                    ct.appendChild(tn);
                }
                var fsz = advanimexto.adjustTextSize(cts[0], sz);
                for (var i = cts.length-1; i>=0; i--) {
                    var ct = cts[i];
                    ct.style['font-size'] = ct.style.fontSize = fsz+'px';
                }
                if (p == 0) {
                    advanimexto.tsz = fsz;
                } else {
                    advanimexto.bsz = fsz;
                }
                if (p == 1) {
                    advanimexto.reposBottomText();
                }
            }



            advanimexto.killNdc = function () {
                if (advanimexto.ndcp != null) {
                    if (!advanimexto.preserve_captions) { // used by i.html
                        advanimexto.t_c = '';
                        advanimexto.b_c = '';
                    }
                    var swf = document.getElementById('advanimaker');
                    if (advanimexto.swf) {
                        advanimexto.swf.removeChild(swf);
                    }
                    var div = document.getElementById('advanimakerdiv');
                    if (div) {
                        advanimexto.cd.removeChild(div);
                    }
                    var div = document.getElementById("advanimradiodiv");
                    if (div) {
                        advanimexto.cd.removeChild(div);
                    }
                    delete(advanimexto.swf);
                    advanimexto.sizeset = false;
                    advanimexto.vis = false;
                    advanimexto.olink = '';
                    if (typeof(advanimexto.hide_loadie) == 'undefined') {
                        advanimexto.ldg.style.visibility = "visible";
                    }
                    var hides = ('t_cap,b_cap,tccd,tci,bccd,bci,rstcd,rstci,subbtn,mopbtn').split(',');
                    var hn;
                    for (var i = hides.length-1; i>=0; i--) {
                        hn = hides[i];
                        var o = advanimexto[hn];
                        o.style.visibility = 'hidden';
                        if (o.tagName.toLowerCase() == 'textarea') {
                            if (advanimexto.preserve_captions && ((hn == 'tci') || (hn == 'bci'))) {
                                // don't blank em out
                            } else {
                                o.value = '';
                            }
                        }
                    }
                    advanimexto.preserve_captions = false;
                    if (typeof(advanimexto.lg) != 'undefined') {
                        advanimexto.cd.removeChild(advanimexto.lg);
                        delete(advanimexto.lg);
                    }
                    /*
                     if (typeof(advanimexto.lgi) != 'undefined') {
                     clearInterval(advanimexto.lgi);
                     delete(advanimexto.lgi);
                     }
                     */
                    if (typeof(advanimexto.ltdiv) != 'undefined') {
                        advanimexto.cd.removeChild(advanimexto.ltdiv);
                        delete(advanimexto.ltdiv);
                    }
                    if (typeof(advanimexto.chlviv) != 'undefined') {
                        clearInterval(advanimexto.chlviv);
                        delete(advanimexto.chlviv);
                    }
                    advanimexto.rstci.disabled = false;
                    advanimexto.tci.disabled = false;
                    advanimexto.bci.disabled = false;
                    for (var i = advanimexto.tcts.length-1; i>=0; i--) {
                        advanimexto.tcts[i].style.visibility = 'hidden';
                    }
                    for (var i = advanimexto.bcts.length-1; i>=0; i--) {
                        advanimexto.bcts[i].style.visibility = 'hidden';
                    }
                    if (advanimexto.ndci != null) {
                        //advanimexto.cd.removeChild(advanimexto.ndci);
                    }
                    if (advanimexto.canvas != null) {
                        advanimexto.cd.removeChild(advanimexto.canvas);
                    }
                    advanimexto.ndcp.removeChild(advanimexto.cd);
                    advanimexto.ndcp = advanimexto.ndc = advanimexto.ndci = null;
                    advanimexto.subbtn_disabled = false;
                    advanimexto.subbtn.style.cursor = 'pointer';
                    advanimexto.mopbtn_disabled = false;
                    advanimexto.mopbtn.style.cursor = 'pointer';

                    advanimexto.subbtn.style.backgroundPosition = '0px 0px';
                    advanimexto.mopbtn.style.backgroundPosition = '0px 0px';

                }
            }




            advanimexto.gotURLandDimensions = function (u, w, h) {
                advanimLog("guad");
                var swf = document.getElementById('advanimaker');
                if (swf) {
                    swf.setImage(u, w, h);
                }
            }

            advanimexto.gotMemeStuff = function (n, u, a) {
                //if (this.rstci.value == '') {
                if (n != 'untitled meme') {
                    this.rstci.value = n;
                }
                //}
                this.orig_name = n;
                this.orig_bg_img = u; // used to create an accurate template from other site
                if (a != "") {
                    this.aae_id = a; // used to check if livememe imported bg
                }
                if (u.indexOf('livememe:') == -1) {
                    if (typeof(this.chlviv) == 'undefined') {
                        //this.chlviv = setInterval('advanimexto.checkForConversion()', 2500);
                    }
                }
            }


            advanimexto.gotConvertedLivememe = function (u) {
                this.orig_bg_img = u;
                if (typeof(this.chlviv) != 'undefined') {
                    clearInterval(this.chlviv);
                    delete(this.chlviv);
                }
            }



            advanimexto.gotMemeURL = function (u) {
                if (!advanimexto.got_meme_url) {
                    advanimexto.got_meme_url = true;
                    if (localStorage) {
                        localStorage.advanimsuburl = u;
                    }
                    if (advanimexto.submit_to_reddit) {
                        top.location.href = "https://www.reddit.com/r/AdviceAnimals/submit?url="+escape(u)+((advanimexto.rstci.value=='untitled meme')?'':("&title="+escape(advanimexto.rstci.value)));
                    } else {
                        top.location.href = u;
                    }
                }
            }









            advanimexto.last_eos_count = 0;

            advanimexto.markMemes = function () {

                advanimLog("d");

                var mtm = new Date().getTime();

                if (typeof(advanimexto.ltdiv) != 'undefined') {
                    if ((mtm - advanimexto.ustm) > 60000) {
                        var ltdiv = advanimexto.ltdiv;
                        var lttxt = document.createTextNode('We are sorry, the upload failed! Please try again');
                        ltdiv.removeChild(advanimexto.lttxt);
                        ltdiv.appendChild(lttxt);
                        advanimexto.lttxt = lttxt;
                    } else if ((mtm - advanimexto.ustm) > 19000) {
                        var ltdiv = advanimexto.ltdiv;
                        var lttxt = document.createTextNode('Uploading...');
                        ltdiv.removeChild(advanimexto.lttxt);
                        ltdiv.appendChild(lttxt);
                        advanimexto.lttxt = lttxt;
                    } else if ((mtm - advanimexto.ustm) > 8500) {
                        var ltdiv = advanimexto.ltdiv;
                        var lttxt = document.createTextNode('Uploading...');
                        ltdiv.removeChild(advanimexto.lttxt);
                        ltdiv.appendChild(lttxt);
                        advanimexto.lttxt = lttxt;
                    }
                }


                advanimLog("e");

                var eos = document.getElementsByTagName("div");
                if (eos.length == advanimexto.last_eos_count) {
                    return;
                }
                advanimexto.last_eos_count = eos.length;
                var r;
                var o;
                for (var n = eos.length-1; n>=0; n--) {
                    var eo = eos[n];
                    if (eo.className.indexOf("entry") >= 0) {
                        var os = eo.childNodes;
                        for (var i = os.length-1; i>=0; i--) {
                            o = os[i];
                            if ((o.className == "title") && (o.tagName.toLowerCase() == "p")) {
                                if (!o.marked_as_meme) {
                                    var need_mark = false;
                                    var os5 = o.childNodes;
                                    var o5;
                                    for (var m = os5.length-1; m>=0; m--) {
                                        o5 = os5[m];
                                        if (o5.tagName) {
                                            if (o5.tagName.toLowerCase() == "a") {
                                                r = o5.href;
                                                if (r) {
                                                    r = r.toLowerCase();
                                                    for (var h = advanimexto.mdms.length-1; h>=0; h--) {
                                                        var mdm = advanimexto.mdms[h];
                                                        if (r.indexOf(mdm+"/") >= 0) {
                                                            need_mark = true;
                                                            h = m = -1;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (!need_mark) {
                                        continue;
                                    }
                                    var o3 = o;
                                    for (var k = 0; k<8; k++) {
                                        o3 = o3.nextSibling;
                                        if (!o3) {
                                            break;
                                        }
                                        if (o3.tagName) {
                                            if (o3.tagName.toLowerCase() == "ul") {
                                                var os2 = o3.childNodes;
                                                for (var j = os2.length-1; j>=0; j--) {
                                                    var o2 = os2[j];
                                                    if (o2.className == "share") {
                                                        var no = document.createElement("li");
                                                        var ns = document.createElement("span");
                                                        ns.className = "share-button toggle";
                                                        var a = document.createElement("a");
                                                        a.className = "option active login-required";
                                                        a.style.color = '#0000AA';
                                                        a.innerHTML = advanimexto.capt_str;
                                                        a.href = "#";
                                                        a.tabindex="200";
                                                        a.pn = eo;
                                                        a.olink = r;
                                                        advanimLog("g");
                                                        advanimexto.last_generated_captioner = a; // used by single image + add captions page
                                                        a.onclick = function () {
                                                            advanimLog("h");
                                                            if (!advanimexto.logged_in) {
                                                                return false;
                                                            }
                                                            advanimLog("i");
                                                            if (this.innerHTML == advanimexto.capt_str) {
                                                                if (advanimexto.ndcp != null) {
                                                                    advanimexto.ndc.innerHTML = advanimexto.capt_str;
                                                                    advanimexto.killNdc();
                                                                }
                                                                if (typeof(advanimexto.hide_loadie) == 'undefined') {
                                                                    advanimexto.ldg.style.visibility = "visible";
                                                                }
                                                                var cpn = this.pn;
                                                                for (var k=0; k<8; k++) {
                                                                    if (cpn.nextSibling) {
                                                                        cpn = cpn.nextSibling;
                                                                        if (cpn.tagName && (cpn.tagName.toLowerCase() == 'div')) {
                                                                            k = 0x7fff; // busts out of the loop
                                                                            advanimexto.cd.style.height = '24px';
                                                                            cpn.appendChild(advanimexto.cd);
                                                                            this.innerHTML = 'cancel';
                                                                            advanimexto.ndcp = cpn;
                                                                            advanimexto.ndc = this;
                                                                            advanimexto.ndci = document.createElement("img");
                                                                            advanimexto.ndci.border = 0;
                                                                            advanimexto.ndci.style.visibility = "hidden";

                                                                            advanimexto.rstci.value = '';
                                                                            if ((typeof(advanimexto_target_url) != 'undefined') && (advanimexto_target_url.length > 0)) {
                                                                                advanimexto.olink = advanimexto_target_url;
                                                                                advanimexto_target_url = '';
                                                                            } else {
                                                                                advanimexto.olink = this.olink;
                                                                            }


                                                                            if (typeof(advanimexto_want_dank) != 'undefined') {
                                                                                advanimexto.dank = advanimexto_want_dank;
                                                                            }


                                                                            if (typeof(advanimexto_radio_d) != 'undefined') {
                                                                                if (advanimexto_radio_d == 'p:3wblnoh') { // robin williams
                                                                                    window.advanimexto_helptext = 'Rest in peace, Robin Williams<br><br>1951-2014';
                                                                                }
                                                                            }

                                                                            if (typeof(advanimexto_helptext) != 'undefined') {
                                                                                advanimexto.helptextdiv.style.display = 'inline';
                                                                                advanimexto.helptextdiv.innerHTML = advanimexto_helptext;
                                                                                advanimexto_helptext = undefined;
                                                                            } else {
                                                                                advanimexto.helptextdiv.style.display = 'none';
                                                                            }

                                                                            advanimexto.puffwar.style.display = 'none';

                                                                            if (typeof(advanimexto_radio_d) != 'undefined') {


                                                                                if (advanimexto_radio_d == 'p:pypst41') { // puffin
                                                                                    advanimexto.puffwar.style.display = 'inline';
                                                                                }

                                                                                var dds = advanimexto_radio_d.split(", ");
                                                                                if (dds.length > 1) {
                                                                                    for (var qq = dds.length-1; qq>=0; qq--) {
                                                                                        var cdds = dds[qq].split(":");
                                                                                        var nam = cdds[0];
                                                                                        if ((dds.length >= 2) && ((nam == 'a') || (nam == 'animated')) && (qq != 0)) {
                                                                                            dds[qq] = '';
                                                                                        }
                                                                                    }

                                                                                    if (dds.length > 1) {
                                                                                        var div = document.createElement('div');
                                                                                        div.id = 'advanimradiodiv';
                                                                                        div.style.width = '160px';
                                                                                        div.style.position = 'absolute';
                                                                                        div.style['font-family'] = div.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
                                                                                        div.style['font-size'] = div.style.fontSize = '11px';
                                                                                        var form = document.createElement('form');
                                                                                        div.appendChild(form);


                                                                                        for (var qq = 0; qq<dds.length; qq++) {
                                                                                            if (dds[qq].length > 0) {
                                                                                                var cdds = dds[qq].split(":");
                                                                                                var rad = document.createElement('input');
                                                                                                rad.type = 'radio';
                                                                                                rad.name = 'advradya';
                                                                                                rad.value = 'radya'+qq;
                                                                                                var nam = cdds[0];
                                                                                                if (nam == 'p') {
                                                                                                    nam = 'plain';
                                                                                                } else if (nam == 'd') {
                                                                                                    nam = 'dank';
                                                                                                } else if (nam == 'a') {
                                                                                                    nam = 'animated';
                                                                                                }
                                                                                                if (typeof(advanimexto_cur_radio) != 'undefined') {
                                                                                                    if (qq == advanimexto_cur_radio) {
                                                                                                        rad.checked = 'checked';
                                                                                                    }
                                                                                                }

                                                                                                rad.onclick = function () {
                                                                                                    clickedAdvAnimRadio(Number(this.value.split("radya")[1]));
                                                                                                }

                                                                                                var tn = document.createTextNode(nam);
                                                                                                form.appendChild(rad);
                                                                                                form.appendChild(tn);
                                                                                                var br = document.createElement("br");
                                                                                                form.appendChild(br);
                                                                                            }
                                                                                        }
                                                                                        advanimexto.cd.appendChild(div);
                                                                                    }
                                                                                }



                                                                            }

                                                                            advanimLog("j");
                                                                            if (advanimexto.html5) {
                                                                                advanimexto.ndci.onload = function () {
                                                                                    var nw,nh, ow,oh;
                                                                                    ow = nw = this.naturalWidth;
                                                                                    oh = nh = this.naturalHeight;
                                                                                    var ms = Math.max(ow, oh);
                                                                                    var sc = 1;
                                                                                    if (ms > 450) {
                                                                                        sc = 450/ms;
                                                                                        nw = this.width = Math.ceil(nw*sc);
                                                                                        nh = this.height = Math.ceil(nh*sc);
                                                                                    }
                                                                                    advanimexto.sc = sc;

                                                                                    advanimexto.vis = true;

                                                                                    advanimexto.ow = ow;
                                                                                    advanimexto.oh = oh;

                                                                                    advanimexto.nw = nw;
                                                                                    advanimexto.nh = nh;

                                                                                    advanimexto.sizeWasSet();


                                                                                    advanimexto.setCaption(0, '');
                                                                                    advanimexto.setCaption(1, '');
                                                                                    advanimexto.redraw(0);
                                                                                    advanimexto.redraw(1);


                                                                                    var t_cap = advanimexto.t_cap;
                                                                                    var b_cap = advanimexto.b_cap;

                                                                                    var tcts = advanimexto.tcts;
                                                                                    var bcts = advanimexto.bcts;




                                                                                    var tcx = advanimexto.tcx = 16;
                                                                                    var tcy = advanimexto.tcy = 12;


                                                                                    for (var q = tcts.length-1; q>=0; q--) {
                                                                                        var tct = tcts[q];
                                                                                        var tcw = nw-32;
                                                                                        tct.style.width = tcw+'px';
                                                                                        var tch = Math.ceil(nh*.25);
                                                                                        tct.style.height = tch+'px';
                                                                                        if (q == 0) {
                                                                                            var d = 0;
                                                                                            advanimexto.tcw = tcw;
                                                                                            advanimexto.tch = tch;
                                                                                        } else {
                                                                                            var d = 4;
                                                                                        }
                                                                                        tct.style.left = (tcx + Math.round(d*Math.cos((q/(tcts.length-1))*(2*Math.PI))))+'px';
                                                                                        tct.style.top = (tcy + Math.round(d*Math.sin((q/(tcts.length-1))*(2*Math.PI))))+'px';
                                                                                    }
                                                                                    t_cap.style.width = advanimexto.tcw+'px';
                                                                                    t_cap.style.height = advanimexto.tch+'px';
                                                                                    t_cap.style.left = (advanimexto.tcx) + 'px';
                                                                                    t_cap.style.top = (advanimexto.tcy) + 'px';



                                                                                    var bcw = advanimexto.bcw = nw-32;
                                                                                    var bch = advanimexto.bch = Math.ceil(nh*.314159);
                                                                                    var bcx = advanimexto.bcx = 16;
                                                                                    var bcy = advanimexto.bcy = nh - (bch+12);

                                                                                    b_cap.style.width = bcw+'px';
                                                                                    b_cap.style.height = bch+'px';
                                                                                    b_cap.style.left = (advanimexto.bcx) + 'px';
                                                                                    b_cap.style.top = (advanimexto.bcy)+'px';

                                                                                    advanimexto.reposBottomText();


                                                                                    var doers = ['cover','holda'];
                                                                                    for (var q = doers.length-1; q>=0; q--) {
                                                                                        var o = advanimexto[doers[q]];
                                                                                        o.style.width = nw+'px';
                                                                                        o.style.height = nh+'px';
                                                                                        o.style.left = advanimexto.ofx+'px';
                                                                                        o.style.top = advanimexto.ofy+'px';
                                                                                    }

                                                                                    var canvas = document.createElement('canvas');


                                                                                    canvas.style['z-index'] = canvas.style.zIndex = 0x7fff0000;
                                                                                    canvas.style.position = 'absolute';
                                                                                    canvas.style.left = advanimexto.ofx+'px';
                                                                                    canvas.style.top = advanimexto.ofy+'px';
                                                                                    canvas.id = 'advanimcanvas';

                                                                                    advanimexto.canvas = canvas;

                                                                                    canvas.width = nw;
                                                                                    canvas.height = nh;
                                                                                    advanimexto.cd.appendChild(canvas);


                                                                                    var context = canvas.getContext('2d');
                                                                                    try {
                                                                                        context.drawImage(advanimexto.ndci, 0, 0, ow, oh, 0, 0, nw, nh);
                                                                                    } catch (e) {
                                                                                        if (typeof(console) != 'undefined') {
                                                                                            if (typeof(console.log) != 'undefined') {
                                                                                                console.log('wtf '+advanimexto.ndci+'    '+e);
                                                                                            }
                                                                                        }
                                                                                    }




                                                                                    this.style.visibility = "visible";


                                                                                    advanimexto.showInputs();
                                                                                    for (var q = advanimexto.tcts.length-1; q>=0; q--) {
                                                                                        advanimexto.tcts[q].style.visibility = 'visible';
                                                                                    }
                                                                                    for (var q = advanimexto.bcts.length-1; q>=0; q--) {
                                                                                        advanimexto.bcts[q].style.visibility = 'visible';
                                                                                    }


                                                                                    advanimexto.setCaption(0, advanimexto.t_c);
                                                                                    advanimexto.setCaption(1, advanimexto.b_c);

                                                                                }

                                                                                advanimexto.ndci.src = advanimexto.getImgURL(advanimexto.olink);

                                                                            } else { // we're flash

                                                                                advanimLog("l");
                                                                                var div = document.createElement('div');
                                                                                div.id = 'advanimakerdiv';
                                                                                div.style.width = '1px';
                                                                                div.style.height = '1px';
                                                                                div.style.position = 'absolute';
                                                                                div.style.left = advanimexto.ofx + 'px';
                                                                                div.style.top = advanimexto.ofy + 'px';
                                                                                div.style.overflow = 'hidden';
                                                                                div.style['z-index'] = div.style.zIndex = 0x7fff0000;
                                                                                div.innerHTML = '<object name="advanimakerrr" width="450" height="450" id="advanimaker" data="'+window.location.protocol+'//www.livememe.com/genz.swf" type="application/x-shockwave-flash"><param name="wmode" value="opaque" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="salign" value="lt" /><param name="scale" value="noscale" /><param name="movie" value="'+window.location.protocol+'//www.livememe.com/genz.swf"/></object>';
                                                                                advanimexto.swf = div;
                                                                                advanimexto.cd.appendChild(div);

                                                                                advanimLog("m");
                                                                            }



                                                                            var o = document.createElement('script');
                                                                            o.src = advanimexto.getNameGrabURL(advanimexto.olink);
                                                                            document.body.appendChild(o);

                                                                            advanimLog("k");
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if (advanimexto.ndc == this) {
                                                                    advanimexto.killNdc();
                                                                }
                                                                this.innerHTML = advanimexto.capt_str;
                                                            }
                                                            return false;
                                                        };
                                                        ns.appendChild(a);
                                                        no.appendChild(ns);
                                                        o3.insertBefore(no,o2);
                                                        o.marked_as_meme = true;
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            advanimexto.markMemes();
            setInterval("advanimexto.markMemes()", 1000);
        }
    }

    if (typeof(advanimScriptLoaded) != 'undefined') {
        advanimScriptLoaded();
    }
}
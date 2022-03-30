$(document).ready(function () {
    var urlpost = DOMAIN_API + idUser + '/' + idfile;
    //console.log(document.referrer.split("/").slice(0,3).join("/"));
    $.post(urlpost, { "referrer": document.referrer.split("/").slice(0, 3).join("/") || 'nosite', "typeend": TYPEEND || 'png' }, function (data) {
        if (data) {
            //console.log(data);
            if (data.status == 0) {
                $('#loader-box').hide()
                $('#msg-box').html(data.msg);
                $('#msg-box').css("visibility", "visible");
            } else if (data.status == 1) {
                if (data.type == 1) {
                    var dataall = arraytom3u8_v2(data.v, data.tgdr, data.data, DOMAIN_LIST_RD, TYPEEND);
                    var pdtall = URL.createObjectURL(new Blob([dataall], { type: "application/x-mpegURL" }));
                    loadPlayer(pdtall, data.configjwp);
                } else if (data.type == 2) {
                    loadPlayer(data.data, data.configjwp);
                } else if (data.type == 3) {
                    var dataall = arraytom3u8_v3(data.tgdr, data.data, DOMAIN_LIST_RD);
                    var pdtall = URL.createObjectURL(new Blob([dataall], { type: "application/x-mpegURL" }));
                    loadPlayer(pdtall, data.configjwp);
                }
            }
        }
    });
    $.get(DOMAIN_API_VIEW + idfile);
});

function arraytom3u8_v2(v, tgdr, datar, domain_list_rd, typeend) {
    var tv = ["#EXTM3U"];
    var numdm_rd = domain_list_rd.length;
    tv.push("#EXT-X-VERSION:3"); tv.push("#EXT-X-TARGETDURATION:" + tgdr); tv.push("#EXT-X-PLAYLIST-TYPE:VOD");
    for (var i = 0; i < datar[0].length; i++) {
        tv.push("#EXTINF:" + datar[0][i] + ",");
        var domainchunk = domain_list_rd[i % numdm_rd];
        if (typeof (domainchunk) == 'string') {
            tv.push(location.protocol + "//" + domainchunk + "/stream/v" + v + "/" + datar[1][i] + "." + typeend);
        } else if (typeof (domainchunk) == 'object') {
            var laynguyen = (i - i % numdm_rd) / numdm_rd;
            var domainnew = domainchunk[laynguyen % domainchunk.length];
            tv.push(location.protocol + "//" + domainnew + "/stream/v" + v + "/" + datar[1][i] + "." + typeend);
        }
    }
    return tv.push("#EXT-X-ENDLIST"), tv.join("\n")
}

function arraytom3u8_v3(tgdr, datar, domain_list_rd) {
    var tv = ["#EXTM3U"];
    var numdm_rd = domain_list_rd.length;
    tv.push("#EXT-X-VERSION:3"); tv.push("#EXT-X-TARGETDURATION:" + tgdr); tv.push("#EXT-X-PLAYLIST-TYPE:VOD");
    for (var i = 0; i < datar[0].length; i++) {
        tv.push("#EXTINF:" + datar[0][i] + ",");
        var domainchunk = domain_list_rd[i % numdm_rd];
        if (typeof (domainchunk) == 'string') {
            tv.push(location.protocol + "//" + domainchunk + "/" + datar[1][i]);
        } else if (typeof (domainchunk) == 'object') {
            var laynguyen = (i - i % numdm_rd) / numdm_rd;
            var domainnew = domainchunk[laynguyen % domainchunk.length];
            tv.push(location.protocol + "//" + domainnew + "/" + datar[1][i]);
        }
    }
    return tv.push("#EXT-X-ENDLIST"), tv.join("\n")
}

function Storage() {
    var storage = {
        type: "localStorage",
        setItem: function setItem(key, value) {
            if (!window.localStorage || !window.sessionStorage) {
                throw new Error("really old browser");
            }
            try {
                localStorage.setItem(key, value);
            } catch (err) {
                try { //this should always work
                    storage.type = "sessionStorage";
                    sessionStorage.setItem(key, value);
                } catch (sessErr) {
                    //do we dare try cookies?
                    throw sessErr;
                }
            }
        },
        getItem: function getItem(key) {
            return window[storage.type].getItem(key);
        }
    };
    return storage;
}
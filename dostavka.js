window.t_delivery__browserLang = (window.navigator.userLanguage || window.navigator.language).toUpperCase().slice(0, 2),
t_onReady((function() {
    var e = document.getElementById("allrecords");
    if (e)
        var t = e.getAttribute("data-tilda-project-lang");
    t && (window.t_delivery__browserLang = t)
}
)),
window.t_delivery__isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var tcart_newDelivery = {
    deliveryState: {
        currentRequest: null,
        projectId: null,
        city: {},
        services: {},
        searchboxes: {},
        focusoutTimers: {},
        cityCoordinates: null,
        ymapApiKey: null,
        cityGuid: null,
        streetGuid: null,
        currencyCode: null,
        pickupList: null,
        postalCode: null,
        staticCities: null,
        geoData: null,
        autocompleteData: {
            cities: null
        },
        badResponseCounters: {
            services: 0
        },
        activeServiceUid: null,
        freeDeliveryThreshold: null,
        fullNames: {
            city: "",
            street: "",
            house: "",
            pickup: ""
        },
        isDisableFields: !1
    },
    init: function e(t, r) {
        var a = this;
        window.tcart_newDeliveryActive = !0,
        a.deliveryState.isDisableFields = !!r,
        a.updateProjectId();
        var i = document.querySelector(".t706");
        i && (a.deliveryState.currencyCode = i.getAttribute("data-project-currency-code")),
        a.deliveryState.ymapApiKey = t,
        a.deliveryState.ymapApiKey && a.mapAppendScript("", t);
        var o = i.querySelector(".t-radio__wrapper-delivery")
          , d = i.querySelectorAll(".t-radio__wrapper-delivery");
        d.length > 0 && Array.prototype.forEach.call(d, (function(e) {
            e.innerHTML = ""
        }
        )),
        o.setAttribute("id", "customdelivery");
        var n = a.createTitle(t_delivery__dict("delivery"));
        o.appendChild(n),
        tcart__blockSubmitButton();
        var s = function e(t) {
            if (t) {
                var r = a.createInput("", t_delivery__dict("city"), null, null, null, null, "searchbox-input load js-tilda-rule", "tildadelivery-city", null, null, !0, null, "chosevalue")
                  , i = a.createSearchbox(r, "city-searchbox")
                  , d = a.createInput("", "", null, null, null, null, "", "tildadelivery-postalcode", !0)
                  , n = a.createInput("", "hash", null, null, null, null, "", "tildadelivery-hash", !0)
                  , s = a.createInput("", "country", null, null, null, null, "", "tildadelivery-country", !0);
                o.appendChild(d),
                o.appendChild(n),
                o.appendChild(s),
                o.appendChild(i),
                a.searchboxInit("city-searchbox", "city");
                var l = document.createElement("div"), c;
                if (l.id = "delivery-services-wrapper",
                o.appendChild(l),
                t.cities ? (c = t.cities[0],
                a.deliveryState.staticCities = t.cities) : c = t,
                c && (a.deliveryState.geoData = c,
                a.deliveryState.city = c,
                a.deliveryState.cityGuid = c.guid,
                a.deliveryState.countryIso = c.countryIso,
                a.deliveryState.postalCode = c.postalCode,
                a.deliveryState.cityPostalCode = c.postalCode),
                "" === c.name) {
                    var u = document.querySelector(".t706 #city-searchbox input");
                    return u.classList.remove("load"),
                    void (u.readOnly = !1)
                }
                c.fullName && (document.querySelector(".t706 #city-searchbox .t-input-description").textContent = c.fullName),
                c.countryIso && (document.querySelector('[name="tildadelivery-country"]').value = c.countryIso),
                a.deliveryState.ymapApiKey && c.name && a.getCityCoordinates("yandex", c.name, (function(e) {
                    var t;
                    try {
                        (t = e.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ")) && (t = [t[1], t[0]],
                        a.deliveryState.cityCoordinates = t)
                    } catch (r) {
                        console.error(r)
                    }
                }
                )),
                a.deliveryState.searchboxes["city-searchbox"] || (a.deliveryState.searchboxes["city-searchbox"] = {}),
                a.deliveryState.searchboxes["city-searchbox"].address = c,
                a.deliveryState.fullNames.city = c.fullName,
                c.name && (document.querySelector('input[name="tildadelivery-city"]').value = c.name),
                document.querySelector('input[name="tildadelivery-city"]').setAttribute("data-option-selected", !0),
                a.setPostalCodeInput(c.postalCode),
                a.renderServices(c.postalCode),
                tcart__updateDelivery()
            }
        };
        a.getCityFromGeo(a.deliveryState.projectId, s, (function(e) {
            a.changeEndpoint(e, (function() {
                a.getCityFromGeo(a.deliveryState.projectId, s, (function() {
                    a.showUnavailableMessage(o)
                }
                ))
            }
            ), (function() {
                a.showUnavailableMessage(o)
            }
            ))
        }
        ));
        var l = document.getElementById("customdelivery");
        if (l) {
            var c = "click"
              , u = "";
            window.t_delivery__isMobile ? (c += " touchstart",
            u = ".searchbox-input") : (c += " mousedown",
            u += ".t-input-clear"),
            c.split(" ").forEach((function(e) {
                l.addEventListener(e, (function(e) {
                    for (var t = e.target; t && t != this; t = t.parentNode) {
                        if (t.matches(".searchbox-change-pickup")) {
                            var r = t.closest(".searchbox-wrapper");
                            r && r.classList.remove("show-info")
                        }
                        if (t.matches(u)) {
                            p.call(t, e);
                            break
                        }
                    }
                }
                ), !1)
            }
            ))
        }
        function p(e) {
            var t = e.target
              , r = !1;
            if (t.matches(".searchbox-input") && window.t_delivery__isMobile) {
                var i = getComputedStyle(t)
                  , o = t.offsetWidth + parseInt(i.marginLeft) + parseInt(i.marginRight)
                  , d = t.closest(".t-input-block");
                o - e.offsetX <= 45 && d && d.classList.contains("active") && (r = !0)
            } else
                t.matches(".t-input-clear") && (r = !0);
            if (r) {
                var n = t.closest(".searchbox-wrapper")
                  , s = n.getAttribute("id");
                n.querySelector(".searchbox-list").innerHTML = "",
                clearTimeout(a.deliveryState.focusoutTimers[s]),
                n.querySelector(".searchbox-input").value = "",
                n.querySelector(".t-input-block").classList.remove("active"),
                setTimeout((function() {
                    n.querySelector(".searchbox-input").focus()
                }
                ), 50),
                a.deliveryState.searchboxes[s] && a.deliveryState.searchboxes[s].address && (a.deliveryState.searchboxes[s].address = null)
            }
        }
        a.renderFullAddressNode(),
        window.mauser && t_delivery__loadJSFile("https://static.tildacdn.com/js/tilda-orders-common-1.0.min.js", (function() {
            tcart_newDelivery.fetchLastOrderShipping().then((function(e) {
                window.t_delivery__userFieldsAutoComplete || (window.t_delivery__userFieldsAutoComplete = {});
                var t = document.querySelector('.t706 .t-form [name="tildadelivery-city"]:not([type="radio"])'), r;
                e.city && t && t.value !== e.city && (t.setAttribute("data-option-selected", "false"),
                t.value = e.city,
                t_triggerEvent(t, "keyup"),
                t_triggerEvent(t, "blur")),
                ["street", "house", "entrance", "floor", "aptoffice", "phone", "entrancecode", "comment", "postalcode", "country", "userinitials", "onelineaddress"].forEach((function(t) {
                    if (e[t]) {
                        window.t_delivery__userFieldsAutoComplete[t] = e[t];
                        var r = document.querySelector('.t706 .t-form [name="tildadelivery-' + t + '"]:not([type="radio"])');
                        r && "" === r.value && (r.value = e[t])
                    }
                }
                ))
            }
            )).catch((function() {}
            ))
        }
        ))
    },
    fetchLastOrderShipping: function e() {
        return t_orders__fetchData({
            endpoint: "getlastshipping"
        })
    },
    disableChoseServiceControls: function e() {
        var t = document.querySelectorAll('.t706 input[name="tildadelivery-type"]');
        Array.prototype.forEach.call(t, (function(e) {
            e.setAttribute("disabled", "disabled")
        }
        ))
    },
    enableChoseServiceControls: function e() {
        var t = document.querySelectorAll('.t706 input[name="tildadelivery-type"]');
        Array.prototype.forEach.call(t, (function(e) {
            e.removeAttribute("disabled")
        }
        ))
    },
    getFullAddress: function e() {
        var t = this.deliveryState.fullNames
          , r = "";
        return t.pickup ? r += t.city + ", " + t.pickup : t.street ? r += t.city + ", " + t.street : null === t.pickup && null === t.street && t.house && (r += t.city + ","),
        t.house && (r += " " + t.house),
        "" === r && (r = t.city),
        r
    },
    renderFullAddressNode: function e() {
        var t = document.createElement("div"), r;
        t.classList.add("delivery-full-address"),
        t.classList.add("t-descr"),
        document.querySelector(".t706__cartwin-totalamount-info").insertAdjacentElement("afterend", t)
    },
    setFullAddress: function e(t) {
        var r = document.querySelector(".delivery-full-address");
        r && (r.textContent = t)
    },
    changeCartInputsHandler: function e() {
        var t = this
          , r = document.querySelectorAll(".t706 input");
        Array.prototype.forEach.call(r, (function(e) {
            e.removeEventListener("change", t.saveTcartDelivery),
            e.addEventListener("change", t.saveTcartDelivery)
        }
        ))
    },
    saveTcartDelivery: function e() {
        var t = document.querySelector(".t706"), r;
        ["city", "street", "pickup-name", "house", "entrance", "floor", "aptoffice", "phone", "entrancecode", "comment", "hash", "postalcode", "country", "userinitials", "onelineaddress"].forEach((function(e) {
            var r, a = t.querySelector('[name="tildadelivery-' + e + '"]');
            a && (r = a.value),
            !r && "" !== r || void 0 === window.tcart.delivery || (window.tcart.delivery[e] = r)
        }
        ));
        var a = {
            "service-id": '[name="tildadelivery-type"]:checked',
            "pickup-id": "[data-pickup-id]",
            "pickup-address": "[data-pickup-address]"
        }, i;
        Object.keys(a).forEach((function(e) {
            var r, i = t.querySelector(a[e]);
            i && (r = i.getAttribute("data-" + e)),
            !r && "" !== r || void 0 === window.tcart.delivery || (window.tcart.delivery[e] = r)
        }
        )),
        void 0 === window.t_delivery__userFieldsAutoComplete && (window.t_delivery__userFieldsAutoComplete = {}),
        ["street", "house", "entrance", "floor", "aptoffice", "phone", "entrancecode", "comment", "postalcode", "country", "userinitials", "onelineaddress"].forEach((function(e) {
            var r, a = t.querySelector('[name="tildadelivery-' + e + '"]');
            a && (r = a.value),
            !r && "" !== r || void 0 === window.tcart.delivery || (window.t_delivery__userFieldsAutoComplete[e] = r)
        }
        ))
    },
    restoreTcartDelivery: function e() {
        var t = document.querySelector(".t706"), r = window.t_delivery__userFieldsAutoComplete, a;
        ["street", "house", "entrance", "floor", "aptoffice", "phone", "entrancecode", "comment", "postalcode", "country", "userinitials", "onelineaddress"].forEach((function(e) {
            var a = "tildadelivery-" + e
              , i = t.querySelector("[name=" + a + "]");
            i && void 0 !== r && void 0 !== r[e] && "" !== r[e] && (i.value = r[e],
            "street" === e && tcart__inputErrorHandler.show(i, t_delivery__dict("selectAddress")))
        }
        ))
    },
    mapAppendScript: function e(t, r) {
        var a = document.createElement("script");
        a.src = "https://api-maps.yandex.ru/2.1/?apikey=" + (r || "") + "&lang=ru_RU",
        document.head.appendChild(a)
    },
    mapInit: function e(t) {
        if ("yandex" === t && void 0 !== window.ymaps) {
            var r = document.createElement("div");
            r.id = "delivery-yandex-map",
            document.getElementById("pickup-searchbox").querySelector(".searchbox-inner-wrapper").appendChild(r);
            var a = this;
            window.ymaps.ready((function() {
                window.t_delivery__map = new ymaps.Map("delivery-yandex-map",{
                    center: a.deliveryState.cityCoordinates || [55.76, 37.64],
                    zoom: 8,
                    controls: ["zoomControl"],
                    minZoom: 3,
                    maxZoom: 20
                },{
                    yandexMapDisablePoiInteractivity: !0,
                    suppressMapOpenBlock: !0
                });
                var e, t = window.t_delivery__map.panes.get("events").getElement(), r = {
                    EN: "Use two fingers to move the map",
                    RU: "Чтобы переместить карту проведите по ней двумя пальцами",
                    FR: "Utilisez deux doigts pour déplacer la carte",
                    DE: "Verschieben der Karte mit zwei Fingern",
                    ES: "Para mover el mapa, utiliza dos dedos",
                    PT: "Use dois dedos para mover o mapa",
                    UK: "Переміщуйте карту двома пальцями",
                    JA: "地図を移動させるには指 2 本で操作します",
                    ZH: "使用双指移动地图",
                    PL: "Przesuń mapę dwoma palcami",
                    KK: "Картаны екі саусақпен жылжытыңыз",
                    IT: "Utilizza due dita per spostare la mappa",
                    LV: "Lai pārvietotu karti, bīdiet to ar diviem pirkstiem"
                }, i = {
                    alignItems: "center",
                    boxSizing: "border-box",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontFamily: "Arial,sans-serif",
                    opacity: "0.0",
                    padding: "25px",
                    textAlign: "center",
                    transition: "opacity .3s",
                    touchAction: "auto"
                };
                Object.keys(i).forEach((function(e) {
                    t.style[e] = i[e]
                }
                )),
                window.tStoreIsMobile && (window.t_delivery__map.behaviors.disable("drag"),
                window.ymaps.domEvent.manager.add(t, "touchmove", (function(e) {
                    1 === e.get("touches").length && (t.style.transition = "opacity .3s",
                    t.style.background = "rgba(0, 0, 0, .45)",
                    t.textContent = r[window.t_delivery__browserLang] || r.EN,
                    t.style.opacity = "1")
                }
                )),
                window.ymaps.domEvent.manager.add(t, "touchend", (function() {
                    t.style.transition = "opacity .8s",
                    t.style.opacity = "0"
                }
                )))
            }
            ))
        }
    },
    mapAddPoints: function e(t, r, a) {
        var i = this;
        void 0 !== window.ymaps && window.ymaps.ready((function() {
            window.t_delivery__map.geoObjects && window.t_delivery__map.geoObjects.removeAll();
            var e = [];
            if (r.forEach((function(t) {
                0 === t.coordinates[0] && 0 === t.coordinates[1] || e.push(t.coordinates)
            }
            )),
            e.length > 0) {
                for (var t = new ymaps.Clusterer({
                    preset: "islands#circleIcon",
                    groupByCoordinates: !1,
                    clusterDisableClickZoom: !1,
                    clusterHideIconOnBalloonOpen: !1,
                    geoObjectHideIconOnBalloonOpen: !1
                }), o = function e(t) {
                    var o = r[t]
                      , d = o.name
                      , n = o.address || ""
                      , s = o.workTime || ""
                      , l = o.phones || ""
                      , c = o.addressComment || ""
                      , u = ""
                      , p = "";
                    p += "<b>" + d + "</b>";
                    var v = "";
                    v += "<b>" + t_delivery__dict("address") + ": </b>" + n + "</br>";
                    var y = "";
                    return o.cash && "n" === o.cash && (y += "cash"),
                    v += '<div style="margin: 10px 0;" class="delivery-map-point-select" ' + (y ? 'data-restrictions="' + y + '"' : "") + " data-point-index=" + t + ' onclick="window.tcart__chosePointOnMap(this); return false;">' + t_delivery__dict("select") + "</div>",
                    v += c ? c + "</br>" : "",
                    v += s ? "<b>" + t_delivery__dict("workingHours") + ": </b>" + s + "</br>" : "",
                    l.length && (v += (u = l.length > 1 ? "<b>" + t_delivery__dict("phones") + ": </b>" : "<b>" + t_delivery__dict("phone") + ": </b>") + l.join(", ") + "</br>"),
                    window.tcart__chosePointOnMap = function(e) {
                        var t = e.dataset.pointIndex
                          , o = r[t]
                          , d = a.querySelector(".searchbox-input")
                          , n = a.getAttribute("id");
                        tcart__inputErrorHandler.hide(d),
                        d.setAttribute("data-option-selected", !0),
                        i.deliveryState.fullNames.pickup = o.address;
                        var s = o.postalCode;
                        "" === s && (s = i.deliveryState.cityPostalCode),
                        i.deliveryState.postalCode = s,
                        i.deliveryState.pickupPointId = o.id,
                        i.deliveryState.searchboxes[n] || (i.deliveryState.searchboxes[n] = {}),
                        i.deliveryState.searchboxes[n].address = {
                            name: o.name,
                            pickupid: o.id,
                            postalCode: s
                        },
                        i.setPostalCodeInput(s),
                        i.changePickupHandler(o.id, o.name, s, a, o.address),
                        document.querySelector('.t706 [name="tildadelivery-pickup-name"]').value = o.name,
                        i.saveTcartDelivery(),
                        window.t_delivery__map.balloon.close(),
                        i.showPickupInfo(o.id, a),
                        i.hidePaymentMethod(e)
                    }
                    ,
                    {
                        balloonContentHeader: p,
                        balloonContentBody: v,
                        balloonContentFooter: ""
                    }
                }, d = function e(t) {
                    return {
                        preset: "islands#circleIcon",
                        index: t
                    }
                }, n = [], s = 0, l = e.length; s < l; s++)
                    n[s] = new ymaps.Placemark(e[s],o(s),d(s));
                t.options.set({
                    gridSize: 80,
                    clusterDisableClickZoom: !1
                }),
                t.add(n),
                window.t_delivery__map.geoObjects.add(t),
                window.t_delivery__map.setBounds(t.getBounds(), {
                    checkZoomRange: !0
                }).then((function() {
                    var e = window.t_delivery__map.getZoom();
                    e >= 20 && window.t_delivery__map.setZoom(18),
                    0 === e && window.t_delivery__map.setZoom(8)
                }
                ), this)
            }
        }
        ))
    },
    setPostalCodeInput: function e(t) {
        var r;
        document.querySelector(".t706").querySelector('input[name="tildadelivery-postalcode"]').value = t
    },
    setHashInput: function e(t) {
        var r;
        document.querySelector(".t706").querySelector('input[name="tildadelivery-hash"]').value = t
    },
    createSearchbox: function e(t, r) {
        var a = document.createElement("div");
        a.classList.add("searchbox-wrapper"),
        a.setAttribute("id", r);
        var i = document.createElement("div");
        i.classList.add("searchbox-inner-wrapper"),
        i.appendChild(t);
        var o = document.createElement("div");
        o.classList.add("searchbox-list"),
        o.setAttribute("tabindex", -1),
        i.appendChild(o),
        a.appendChild(i);
        var d = document.createElement("div");
        return d.classList.add("searchbox-info"),
        d.setAttribute("tabindex", -1),
        a.appendChild(d),
        a
    },
    searchboxInit: function e(t, r) {
        var a = document.getElementById(t), i = a.querySelector(".searchbox-input"), o = i.closest(".t-input-block"), d = this, n;
        "paste keyup".split(" ").forEach((function(e) {
            i.addEventListener(e, (function(e) {
                e.keyCode >= 33 && e.keyCode <= 40 || (clearTimeout(n),
                d.deliveryState.searchboxes[t] && (d.deliveryState.searchboxes[t].address = null),
                d.deliveryState.searchboxes[t] && "pickup" !== r && (d.deliveryState.searchboxes[t].autocompleteAddress = null),
                "" === i.value || o.classList.contains("active") || o.classList.add("active"),
                n = setTimeout((function() {
                    d.changeSearchboxInputHandler(e, a, r),
                    n = null
                }
                ), 500))
            }
            ), !1)
        }
        ));
        var s = !1, l;
        "click mousedown keyup".split(" ").forEach((function(e) {
            i.addEventListener(e, (function(e) {
                s || (s = !0,
                clearTimeout(l),
                l = setTimeout((function() {
                    d.clickSearchboxInputHandler(e, a, r)
                }
                ), 150)),
                setTimeout((function() {
                    s = !1
                }
                ), 200)
            }
            ), !1)
        }
        )),
        i.addEventListener("blur", (function(e) {
            var t = e.relatedTarget;
            t && t.classList.contains("searchbox-list") || (clearTimeout(n),
            d.focusoutSearchboxInputHandler(a, r))
        }
        ), !1)
    },
    clickSearchboxInputHandler: function e(t, r, a) {
        var i = r.querySelector(".searchbox-input")
          , o = i.closest(".t-input-block");
        "" === i.value || o.classList.contains("active") || o.classList.add("active");
        var d = r.querySelector(".searchbox-list"), n;
        if (r.querySelectorAll(".searchbox-list-item").length)
            d.style.display = "";
        else if (!i.classList.contains("load")) {
            var s, l = parseInt(i.getAttribute("data-service-id"), 10);
            l && (s = this.deliveryState.services[l].strongAddress);
            var c = this
              , u = r.getAttribute("id");
            this.deliveryState.searchboxes[u] && "pickup" !== a && (this.deliveryState.searchboxes[u].autocompleteAddress = null);
            var p = (t.target.value || "").trim(), v, y;
            switch (r.classList.contains("load") || (r.classList.add("load"),
            r.readOnly = !0),
            a) {
            case "city":
                if ("" === p)
                    return d.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>",
                    d.style.display = "",
                    r.classList.remove("load"),
                    void (r.readOnly = !1);
                if (v = {
                    pattern: p
                },
                v = JSON.stringify(v),
                c.deliveryState.searchboxes[u] && (c.deliveryState.searchboxes[u].autocompleteAddress || c.deliveryState.staticCities)) {
                    if (r.classList.remove("load"),
                    r.readOnly = !1,
                    (y = c.deliveryState.staticCities || c.deliveryState.searchboxes[u].autocompleteAddress).error || 0 === y.length)
                        return void ("" !== i.value ? d.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : d.innerHTML = "");
                    d.style.display = "",
                    c.deliveryState.searchboxes[u].autocompleteAddress = y[0],
                    c.deliveryState.searchboxes[u].addresses = y,
                    c.deliveryState.autocompleteData.cities = y,
                    c.fillSearchList(d, y, "address"),
                    c.choseSearchListItemHandler(r, a)
                } else {
                    var m = function e(t) {
                        r.classList.remove("load"),
                        r.readOnly = !1,
                        t.error || 0 === t.length ? "" !== i.value ? d.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : d.innerHTML = "" : (d.style.display = "",
                        c.deliveryState.searchboxes[u].autocompleteAddress = t[0],
                        c.deliveryState.searchboxes[u].addresses = t,
                        c.deliveryState.autocompleteData.cities = t,
                        c.fillSearchList(d, t, "address"),
                        c.choseSearchListItemHandler(r, a))
                    };
                    c.getAddresses(v, a, m, (function(e) {
                        c.changeEndpoint(e, (function() {
                            c.getAddresses(v, a, m)
                        }
                        ))
                    }
                    ))
                }
                break;
            case "pickup":
                var h = i.getAttribute("data-service-id")
                  , f = ""
                  , _ = document.querySelector('.t706 input.t-radio_delivery[data-service-id="' + h + '"]');
                if (_ && (f = _.dataset.restrictions || ""),
                c.deliveryState.searchboxes[u] && c.deliveryState.searchboxes[u].autocompleteAddress) {
                    if (r.classList.remove("load"),
                    r.readOnly = !1,
                    (y = c.deliveryState.searchboxes[u].autocompleteAddress).error || 0 === y.length) {
                        d.innerHTML = "";
                        var S = window.t_delivery__browserLang.toLowerCase()
                          , g = y.userFriendlyError ? y.userFriendlyError[S] ? y.userFriendlyError[S] : y.userFriendlyError.en : "";
                        return void tcart__errorHandler.show(g || y.error)
                    }
                    y = (y = y.filter((function(e) {
                        return -1 !== e.name.toLowerCase().indexOf(p.toLowerCase()) || -1 !== e.address.toLowerCase().indexOf(p.toLowerCase())
                    }
                    ))).map((function(e) {
                        return "cash" === f && (e.cash = "n"),
                        e
                    }
                    )),
                    c.deliveryState.searchboxes[u] || (c.deliveryState.searchboxes[u] = {}),
                    c.fillSearchList(d, y, "pickup"),
                    c.choseSearchListItemHandler(r, a)
                } else {
                    var b = function e(t) {
                        if (r.classList.remove("load"),
                        r.readOnly = !1,
                        t.error || 0 === t.length) {
                            "" !== i.value ? d.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : d.innerHTML = "";
                            var o = window.t_delivery__browserLang.toLowerCase()
                              , n = t.userFriendlyError ? t.userFriendlyError[o] ? t.userFriendlyError[o] : t.userFriendlyError.en : "";
                            tcart__errorHandler.show(n || t.error)
                        } else
                            c.deliveryState.searchboxes[u] || (c.deliveryState.searchboxes[u] = {}),
                            c.deliveryState.searchboxes[u].autocompleteAddress = t,
                            c.deliveryState.pickupList = t,
                            c.fillSearchList(d, t, "pickup"),
                            c.choseSearchListItemHandler(r, a)
                    };
                    c.getPickupList({
                        projectId: c.deliveryState.projectId,
                        postalCode: c.deliveryState.city.postalCode,
                        deliveryId: h,
                        pattern: p,
                        onDone: b,
                        onFail: function e(t) {
                            c.changeEndpoint(t, (function() {
                                c.getPickupList({
                                    projectId: c.deliveryState.projectId,
                                    postalCode: c.deliveryState.city.postalCode,
                                    deliveryId: h,
                                    pattern: p,
                                    onDone: b
                                })
                            }
                            ))
                        }
                    })
                }
                break;
            case "street":
                v = {
                    pattern: p,
                    fias: this.deliveryState.cityGuid
                },
                v = JSON.stringify(v),
                c.deliveryState.searchboxes[u] || (c.deliveryState.searchboxes[u] = {}),
                s && "street" === a && i.setAttribute("data-option-selected", !1);
                var w = function e(t) {
                    r.classList.remove("load"),
                    r.readOnly = !1,
                    t.error || 0 === t.length ? "" !== i.value ? d.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : d.innerHTML = "" : (c.deliveryState.searchboxes[u].autocompleteAddress = t[0],
                    c.fillSearchList(d, t, "address"),
                    c.choseSearchListItemHandler(r, a))
                };
                c.getAddresses(v, a, w, (function(e) {
                    c.changeEndpoint(e, (function() {
                        c.getAddresses(v, a, w)
                    }
                    ))
                }
                ));
                break;
            case "house":
                v = {
                    pattern: p,
                    fias: this.deliveryState.streetGuid || this.deliveryState.cityGuid
                },
                v = JSON.stringify(v);
                var E = function e(t) {
                    r.classList.remove("load"),
                    r.readOnly = !1,
                    t.error || 0 === t.length ? d.innerHTML = "" : (c.deliveryState.searchboxes[u] || (c.deliveryState.searchboxes[u] = {}),
                    c.deliveryState.searchboxes[u].autocompleteAddress = t[0],
                    c.fillSearchList(d, t, "address"),
                    c.choseSearchListItemHandler(r, a))
                };
                c.getAddresses(v, a, E, (function(e) {
                    c.changeEndpoint(e, (function() {
                        c.getAddresses(v, a, E)
                    }
                    ))
                }
                ));
                break;
            default:
                r.classList.remove("load"),
                r.readOnly = !1
            }
        }
    },
    changeSearchboxInputHandler: function e(t, r, a) {
        var i = this, o = r.querySelector(".searchbox-list"), d = r.querySelector(".searchbox-input"), n = d.closest(".t-input-block"), s = r.getAttribute("id"), l = parseInt(d.getAttribute("data-service-id")), c;
        if (l && (c = this.deliveryState.services[l].strongAddress),
        !d.classList.contains("load")) {
            var u = (t.target.value || "").trim(), p, v;
            switch (r.classList.contains("load") || (r.classList.add("load"),
            r.readOnly = !0),
            "" === d.value && n.classList.remove("active"),
            a) {
            case "city":
                if (p = {
                    pattern: u
                },
                p = JSON.stringify(p),
                i.deliveryState.searchboxes[s] || (i.deliveryState.searchboxes[s] = {}),
                i.deliveryState.searchboxes[s] && i.deliveryState.staticCities) {
                    if (r.classList.remove("load"),
                    r.readOnly = !1,
                    v = i.deliveryState.staticCities,
                    Array.isArray(v) ? v = v.filter((function(e) {
                        return -1 !== e.name.toLowerCase().indexOf(u.toLowerCase()) || -1 !== e.fullName.toLowerCase().indexOf(u.toLowerCase())
                    }
                    )) : console.log(v),
                    0 === v.length)
                        return void ("" !== d.value ? o.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : o.innerHTML = "");
                    i.deliveryState.searchboxes[s].autocompleteAddress = v[0],
                    i.deliveryState.searchboxes[s].addresses = v,
                    i.deliveryState.autocompleteData.cities = v,
                    i.fillSearchList(o, v, "address"),
                    i.choseSearchListItemHandler(r, a)
                } else {
                    var y = function e(t) {
                        r.classList.remove("load"),
                        r.readOnly = !1,
                        t.error || 0 === t.length ? "" !== d.value ? o.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : o.innerHTML = "" : (i.deliveryState.searchboxes[s].autocompleteAddress = t[0],
                        i.deliveryState.searchboxes[s].addresses = t,
                        i.deliveryState.autocompleteData.cities = t,
                        i.fillSearchList(o, t, "address"),
                        i.choseSearchListItemHandler(r, a))
                    };
                    i.getAddresses(p, a, y, (function(e) {
                        i.changeEndpoint(e, (function() {
                            i.getAddresses(p, a, y)
                        }
                        ))
                    }
                    ))
                }
                break;
            case "pickup":
                if (d.setAttribute("data-option-selected", !1),
                i.deliveryState.searchboxes[s] && i.deliveryState.searchboxes[s].autocompleteAddress) {
                    if (r.classList.remove("load"),
                    r.readOnly = !1,
                    0 === (v = (v = i.deliveryState.searchboxes[s].autocompleteAddress).filter((function(e) {
                        return -1 !== e.name.toLowerCase().indexOf(u.toLowerCase()) || -1 !== e.address.toLowerCase().indexOf(u.toLowerCase())
                    }
                    ))).length)
                        return void ("" !== d.value ? o.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : o.innerHTML = "");
                    i.fillSearchList(o, v, "pickup"),
                    i.choseSearchListItemHandler(r, a)
                }
                break;
            case "street":
                p = {
                    pattern: u,
                    fias: this.deliveryState.cityGuid
                },
                p = JSON.stringify(p),
                i.deliveryState.searchboxes[s] || (i.deliveryState.searchboxes[s] = {}),
                c && d.setAttribute("data-option-selected", !1);
                var m = function e(t) {
                    r.classList.remove("load"),
                    r.readOnly = !1,
                    t.error || 0 === t.length ? "" !== d.value ? o.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : o.innerHTML = "" : (i.deliveryState.searchboxes[s].autocompleteAddress = t[0],
                    i.deliveryState.searchboxes[s].addresses = t,
                    i.fillSearchList(o, t, "address"),
                    i.choseSearchListItemHandler(r, a))
                };
                i.getAddresses(p, a, m, (function(e) {
                    i.changeEndpoint(e, (function() {
                        i.getAddresses(p, a, m)
                    }
                    ))
                }
                ));
                break;
            case "house":
                p = {
                    pattern: u,
                    fias: this.deliveryState.streetGuid || this.deliveryState.cityGuid
                },
                p = JSON.stringify(p),
                i.deliveryState.searchboxes[s] || (i.deliveryState.searchboxes[s] = {});
                var h = function e(t) {
                    r.classList.remove("load"),
                    r.readOnly = !1,
                    t.error || 0 === t.length ? "" !== d.value ? o.innerHTML = '<div class="searchbox-list-item t-text" style="user-select: none; pointer-events: none;">' + t_delivery__dict("noResult") + "</div>" : o.innerHTML = "" : (i.deliveryState.searchboxes[s].autocompleteAddress = t[0],
                    i.deliveryState.searchboxes[s].addresses = t,
                    i.fillSearchList(o, t, "address"),
                    i.choseSearchListItemHandler(r, a))
                };
                i.getAddresses(p, a, h, (function(e) {
                    i.changeEndpoint(e, (function() {
                        i.getAddresses(p, a, h)
                    }
                    ))
                }
                ))
            }
        }
    },
    choseSearchListItemHandler: function e(t, r) {
        var a = t.getAttribute("id"), i = t.querySelector(".searchbox-input"), o = t.querySelector(".t-input-description"), d = t.querySelector(".searchbox-list"), n = t.querySelectorAll(".searchbox-list-item"), s, l = this, c, u = i.closest(".t-input-block");
        tcart__inputErrorHandler.hide(i);
        var p = !1;
        "click mousedown".split(" ").forEach((function(e) {
            Array.prototype.forEach.call(n, (function(n) {
                n.addEventListener(e, (function(e) {
                    if (!p) {
                        switch (p = !0,
                        tcart__blockSubmitButton(),
                        u.classList.remove("active"),
                        clearTimeout(l.deliveryState.focusoutTimers[a]),
                        s = e.target.dataset.postalcode,
                        l.deliveryState.postalCode = s,
                        l.setPostalCodeInput(s),
                        l.deliveryState.searchboxes[a] || (l.deliveryState.searchboxes[a] = {}),
                        r) {
                        case "city":
                            var n;
                            i.classList.add("load"),
                            i.readOnly = !0,
                            tcart__errorHandler.hide(),
                            i.value = e.target.dataset.name,
                            o.innerHTML = e.target.dataset.fullName,
                            document.querySelector('.t706 [name="tildadelivery-country"]').value = e.target.dataset.countryIso,
                            i.setAttribute("data-guid", e.target.dataset.guid),
                            l.deliveryState.ymapApiKey && e.target.dataset.name && l.getCityCoordinates("yandex", e.target.dataset.name, (function(t) {
                                var r;
                                try {
                                    (r = t.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ")) && (r = [r[1], r[0]],
                                    l.deliveryState.cityCoordinates = r)
                                } catch (e) {
                                    console.error(e)
                                }
                            }
                            )),
                            l.deliveryState.searchboxes[a].address = {
                                name: e.target.dataset.name,
                                postalCode: s,
                                guid: e.target.dataset.guid
                            },
                            l.deliveryState.city = {
                                name: e.target.dataset.name,
                                fullName: e.target.dataset.fullName,
                                postalCode: s,
                                guid: e.target.dataset.guid,
                                hasStreets: e.target.dataset.hasStreets
                            },
                            e.target.dataset.hasHousesWithoutStreets && (l.deliveryState.city.hasHousesWithoutStreets = !0),
                            l.deliveryState.cityPostalCode = s;
                            for (var v = l.deliveryState.autocompleteData.cities.length, y = 0; y < v; y++)
                                if (l.deliveryState.autocompleteData.cities[y].guid === e.target.dataset.guid) {
                                    n = l.deliveryState.autocompleteData.cities[y];
                                    break
                                }
                            l.deliveryState.geoData = n,
                            l.deliveryState.cityGuid = e.target.dataset.guid,
                            l.deliveryState.streetGuid = null,
                            l.deliveryState.fullNames = {},
                            l.deliveryState.fullNames.city = e.target.dataset.fullName,
                            document.getElementById("delivery-services-wrapper").innerHTML = "",
                            l.renderServices(s),
                            d.style.display = "none";
                            break;
                        case "street":
                            c = parseInt(i.getAttribute("data-service-id"), 10),
                            i.value = e.target.dataset.shortname,
                            i.setAttribute("data-guid", e.target.dataset.guid),
                            s = s || l.deliveryState.city.postalCode,
                            l.deliveryState.searchboxes[a].address = {
                                name: e.target.dataset.name,
                                shortName: e.target.dataset.shortname,
                                postalCode: s,
                                guid: e.target.dataset.guid
                            },
                            l.deliveryState.streetGuid = e.target.dataset.guid,
                            l.deliveryState.fullNames.street = e.target.dataset.shortname,
                            l.deliveryState.fullNames.house = null,
                            l.clearHouseInput(),
                            window.tcart.emptyDeliveryServices = !0,
                            tcart__updateDelivery();
                            var m = function e(t) {
                                if (t.error || 0 === t.length) {
                                    var r = window.t_delivery__browserLang.toLowerCase()
                                      , a = t.userFriendlyError ? t.userFriendlyError[r] ? t.userFriendlyError[r] : t.userFriendlyError.en : "";
                                    return tcart__errorHandler.show(a || t.error),
                                    window.tcart.emptyDeliveryServices = !0,
                                    void tcart__updateDelivery()
                                }
                                if (window.tcart.emptyDeliveryServices = !1,
                                tcart__errorHandler.hide(),
                                void 0 !== t.hash && l.setHashInput(t.hash),
                                void 0 !== t.price) {
                                    var i = t.price;
                                    l.updatePriceValueInRadio(i, c)
                                }
                                l.setFullAddress(l.getFullAddress()),
                                tcart__showDeliveryPrice()
                            };
                            l.getDeliveryPrice({
                                projectId: l.deliveryState.projectId,
                                postalCode: s,
                                serviceId: c,
                                onDone: m,
                                onFail: function e(t) {
                                    l.changeEndpoint(t, (function() {
                                        l.getDeliveryPrice({
                                            projectId: l.deliveryState.projectId,
                                            postalCode: s,
                                            serviceId: c,
                                            onDone: m,
                                            onFail: function e() {
                                                var t = "";
                                                t = "RU" === window.t_delivery__browserLang ? 'Невозможно получить почтовый индекс для доставки. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a postal code for delivery. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
                                                tcart__errorHandler.show("Request failed: " + t),
                                                window.tcart.emptyDeliveryServices = !0,
                                                tcart__updateDelivery()
                                            }
                                        })
                                    }
                                    ))
                                }
                            }),
                            d.innerHTML = "";
                            break;
                        case "pickup":
                            var h = e.target.dataset.coordinates.split(",");
                            l.hidePaymentMethod(e.target);
                            var f = e.target.dataset.name || e.target.dataset.address;
                            l.changePickupHandler(e.target.dataset.pickupid, f, s, t, e.target.dataset.address, h),
                            l.deliveryState.searchboxes[a].address = {
                                name: f,
                                pickupid: e.target.dataset.pickupid,
                                postalCode: s
                            },
                            l.deliveryState.fullNames[r] = e.target.dataset.address,
                            l.deliveryState.pickupPointId = e.target.dataset.pickupid,
                            l.showPickupInfo(e.target.dataset.pickupid, t),
                            d.innerHTML = "";
                            break;
                        case "house":
                            c = parseInt(i.getAttribute("data-service-id"), 10),
                            i.value = e.target.dataset.name,
                            s = s || l.deliveryState.city.postalCode,
                            l.deliveryState.searchboxes[a].address = {
                                postalCode: s
                            },
                            l.deliveryState.fullNames[r] = e.target.dataset.name,
                            window.tcart.emptyDeliveryServices = !0,
                            tcart__updateDelivery();
                            var _ = function e(t) {
                                if (t.error || 0 === t.length) {
                                    var r = window.t_delivery__browserLang.toLowerCase()
                                      , a = t.userFriendlyError ? t.userFriendlyError[r] ? t.userFriendlyError[r] : t.userFriendlyError.en : "";
                                    return tcart__errorHandler.show(a || t.error),
                                    window.tcart.emptyDeliveryServices = !0,
                                    tcart__updateDelivery(),
                                    void l.removePriceValueInRadio(c)
                                }
                                if (window.tcart.emptyDeliveryServices = !1,
                                tcart__errorHandler.hide(),
                                void 0 !== t.hash && l.setHashInput(t.hash),
                                void 0 !== t.price) {
                                    var i = t.price;
                                    l.updatePriceValueInRadio(i, c)
                                }
                                l.setFullAddress(l.getFullAddress()),
                                tcart__showDeliveryPrice()
                            };
                            l.getDeliveryPrice({
                                projectId: l.deliveryState.projectId,
                                postalCode: s,
                                serviceId: c,
                                onDone: _,
                                onFail: function e(t) {
                                    l.changeEndpoint(t, (function() {
                                        l.getDeliveryPrice({
                                            projectId: l.deliveryState.projectId,
                                            postalCode: s,
                                            serviceId: c,
                                            onDone: _,
                                            onFail: function e() {
                                                var t = "";
                                                t = "RU" === window.t_delivery__browserLang ? 'Невозможно получить почтовый индекс для доставки. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for house" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a postal code for delivery. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for house" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
                                                tcart__errorHandler.show("Request failed: " + t),
                                                window.tcart.emptyDeliveryServices = !0,
                                                tcart__updateDelivery()
                                            }
                                        })
                                    }
                                    ))
                                }
                            }),
                            d.innerHTML = ""
                        }
                        i.setAttribute("data-option-selected", !0),
                        setTimeout((function() {
                            p = !1
                        }
                        ), 200)
                    }
                }
                ), !1)
            }
            ))
        }
        ))
    },
    focusoutSearchboxInputHandler: function e(t, r) {
        var a = this, i, o = t.querySelector(".searchbox-list"), d = t.querySelector(".t-input-description"), n = t.getAttribute("id"), s = t.querySelector(".searchbox-input"), l = s.closest(".t-input-block"), c, u = parseInt(s.getAttribute("data-service-id"), 10), p;
        u && "" !== o.innerHTML ? (p = this.deliveryState.services[u].strongAddress,
        this.deliveryState.city.hasHousesWithoutStreets && (p = !1),
        s.setAttribute("data-option-selected", !1)) : s.setAttribute("data-option-selected", !0),
        this.deliveryState.focusoutTimers[n] = setTimeout((function() {
            if (l.classList.remove("active"),
            a.deliveryState.searchboxes[n] && a.deliveryState.searchboxes[n].address)
                return tcart__inputErrorHandler.hide(s),
                void ("city" === r ? o.style.display = "none" : o.innerHTML = "");
            switch (r) {
            case "city":
                if (a.deliveryState.searchboxes[n] && a.deliveryState.searchboxes[n].autocompleteAddress && s.value === a.deliveryState.searchboxes[n].autocompleteAddress.name) {
                    var e;
                    s.classList.add("load"),
                    s.readOnly = !0,
                    c = a.deliveryState.searchboxes[n].autocompleteAddress,
                    a.deliveryState.searchboxes[n].address = c,
                    tcart__inputErrorHandler.hide(s),
                    a.deliveryState.ymapApiKey && c.name && a.getCityCoordinates("yandex", c.name, (function(e) {
                        var t;
                        try {
                            (t = e.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ")) && (t = [t[1], t[0]],
                            a.deliveryState.cityCoordinates = t)
                        } catch (r) {
                            console.error(r)
                        }
                    }
                    )),
                    i = c.postalCode,
                    a.deliveryState.postalCode = i,
                    a.setPostalCodeInput(i),
                    document.querySelector('[name="tildadelivery-country"]').value = c.countryIso,
                    s.value = c.name,
                    d.innerHTML = c.fullName,
                    s.setAttribute("data-guid", c.guid),
                    a.deliveryState.city.name = c.name,
                    a.deliveryState.city.fullName = c.fullName,
                    a.deliveryState.city.postalCode = i,
                    a.deliveryState.city.guid = c.guid,
                    a.deliveryState.cityPostalCode = i,
                    a.deliveryState.cityGuid = c.guid,
                    a.deliveryState.streetGuid = null,
                    a.deliveryState.fullNames = {},
                    a.deliveryState.fullNames[r] = c.fullName;
                    for (var v = a.deliveryState.autocompleteData.cities.length, y = 0; y < v; y++)
                        if (a.deliveryState.autocompleteData.cities[y].guid === c.guid) {
                            e = a.deliveryState.autocompleteData.cities[y];
                            break
                        }
                    a.deliveryState.geoData = e,
                    o.style.display = "none",
                    a.renderServices(i),
                    s.setAttribute("data-option-selected", !0)
                } else {
                    o.innerHTML = "";
                    var m = document.getElementById("addresses-wrapper");
                    m && m.parentNode && m.parentNode.removeChild(m),
                    s.setAttribute("data-option-selected", !1),
                    a.deliveryState.streetGuid = null,
                    tcart__inputErrorHandler.show(s, t_delivery__dict("selectCity"))
                }
                document.getElementById("delivery-services-wrapper").innerHTML = "";
                break;
            case "street":
                if (a.deliveryState.searchboxes[n] && a.deliveryState.searchboxes[n].autocompleteAddress && s.value === a.deliveryState.searchboxes[n].autocompleteAddress.shortName) {
                    c = a.deliveryState.searchboxes[n].autocompleteAddress,
                    a.deliveryState.searchboxes[n].address = c,
                    a.deliveryState.fullNames[r] = c.shortName,
                    tcart__inputErrorHandler.hide(s),
                    i = c.postalCode,
                    a.deliveryState.postalCode = i,
                    s.value = c.shortName,
                    s.setAttribute("data-guid", c.guid),
                    a.deliveryState.streetGuid = c.guid,
                    a.setPostalCodeInput(i),
                    s.setAttribute("data-option-selected", !0),
                    o.innerHTML = "";
                    var h = function e(t) {
                        if (t.error || 0 === t.length) {
                            var r = window.t_delivery__browserLang.toLowerCase()
                              , i = t.userFriendlyError ? t.userFriendlyError[r] ? t.userFriendlyError[r] : t.userFriendlyError.en : "";
                            tcart__errorHandler.show(i || t.error)
                        } else {
                            if (void 0 !== t.hash && a.setHashInput(t.hash),
                            void 0 !== t.price) {
                                var o = t.price;
                                a.updatePriceValueInRadio(o, u)
                            }
                            a.setFullAddress(a.getFullAddress()),
                            tcart__showDeliveryPrice()
                        }
                    };
                    a.getDeliveryPrice({
                        projectId: a.deliveryState.projectId,
                        postalCode: i,
                        serviceId: u,
                        onDone: h,
                        onFail: function e(t) {
                            a.changeEndpoint(t, (function() {
                                a.getDeliveryPrice({
                                    projectId: a.deliveryState.projectId,
                                    postalCode: i,
                                    serviceId: u,
                                    onDone: h,
                                    onFail: function e() {
                                        var t = "";
                                        t = "RU" === window.t_delivery__browserLang ? 'Невозможно получить почтовый индекс для доставки. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a postal code for delivery. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
                                        tcart__errorHandler.show("Request failed: " + t),
                                        window.tcart.emptyDeliveryServices = !0,
                                        tcart__updateDelivery()
                                    }
                                })
                            }
                            ))
                        }
                    })
                } else
                    p && (s.setAttribute("data-option-selected", !1),
                    o.innerHTML = "",
                    tcart__inputErrorHandler.show(s, t_delivery__dict("selectAddress"))),
                    a.deliveryState.city.hasHousesWithoutStreets && (s.removeAttribute("data-guid"),
                    a.deliveryState.streetGuid = null,
                    a.deliveryState.fullNames.street = null,
                    window.t_delivery__userFieldsAutoComplete && (window.t_delivery__userFieldsAutoComplete.street = ""),
                    tcart__unblockSubmitButton()),
                    o.innerHTML = "";
                a.deliveryState.fullNames.house = null,
                a.clearHouseInput();
                break;
            case "house":
                if (a.deliveryState.searchboxes[n] && a.deliveryState.searchboxes[n].autocompleteAddress && s.value === a.deliveryState.searchboxes[n].autocompleteAddress.name) {
                    c = a.deliveryState.searchboxes[n].autocompleteAddress,
                    a.deliveryState.searchboxes[n].address = c,
                    a.deliveryState.fullNames[r] = c.name,
                    tcart__inputErrorHandler.hide(s),
                    i = c.postalCode,
                    a.deliveryState.postalCode = i,
                    s.val(c.name),
                    s.setAttribute("data-option-selected", !0),
                    a.setPostalCodeInput(i),
                    o.innerHTML = "";
                    var f = function e(t) {
                        if (t.error || 0 === t.length) {
                            var r = window.t_delivery__browserLang.toLowerCase()
                              , i = t.userFriendlyError ? t.userFriendlyError[r] ? t.userFriendlyError[r] : t.userFriendlyError.en : "";
                            tcart__errorHandler.show(i || t.error)
                        } else {
                            if (void 0 !== t.hash && a.setHashInput(t.hash),
                            void 0 !== t.price) {
                                var o = t.price;
                                a.updatePriceValueInRadio(o, u)
                            }
                            a.setFullAddress(a.getFullAddress()),
                            tcart__showDeliveryPrice()
                        }
                    };
                    a.getDeliveryPrice({
                        projectId: a.deliveryState.projectId,
                        postalCode: i,
                        serviceId: u,
                        onDone: f,
                        onFail: function e(t) {
                            a.changeEndpoint(t, (function() {
                                a.getDeliveryPrice({
                                    projectId: a.deliveryState.projectId,
                                    postalCode: i,
                                    serviceId: u,
                                    onDone: f,
                                    onFail: function e() {
                                        var t = "";
                                        t = "RU" === window.t_delivery__browserLang ? 'Невозможно получить почтовый индекс для доставки. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a postal code for delivery. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
                                        tcart__errorHandler.show("Request failed: " + t),
                                        window.tcart.emptyDeliveryServices = !0,
                                        tcart__updateDelivery()
                                    }
                                })
                            }
                            ))
                        }
                    })
                } else
                    o.innerHTML = "",
                    a.deliveryState.city.hasHousesWithoutStreets && tcart__inputErrorHandler.show(s, t_delivery__dict("selectAddress"));
                break;
            case "pickup":
                o.innerHTML = "";
                var _ = null
                  , S = null;
                a.deliveryState.searchboxes[n] && a.deliveryState.searchboxes[n].autocompleteAddress && (_ = c = a.deliveryState.searchboxes[n].autocompleteAddress).forEach((function(e) {
                    e.name === s.value && (S = e)
                }
                )),
                _ && S ? (c = S,
                a.deliveryState.searchboxes[n].address = c,
                a.deliveryState.fullNames[r] = c.address,
                tcart__inputErrorHandler.hide(s),
                s.setAttribute("data-option-selected", !0),
                a.changePickupHandler(c.id, c.name, c.postalCode, t, c.address, c.coordinates),
                a.setPostalCodeInput(c.postalCode),
                a.deliveryState.pickupPointId = c.id,
                a.deliveryState.postalCode = c.postalCode,
                o.innerHTML = "") : (s.setAttribute("data-option-selected", !1),
                s.removeAttribute("data-pickup-id"),
                s.removeAttribute("data-pickup-address"),
                s.removeAttribute("data-delivery-price"),
                delete a.deliveryState.pickupPointId,
                tcart__inputErrorHandler.show(s, t_delivery__dict("selectAddress")))
            }
        }
        ), 200)
    },
    fillSearchList: function e(t, r, a) {
        var i = document.createElement("div"), o, d, n;
        r.forEach((function(e) {
            var t = document.createElement("div");
            switch (t.classList.add("searchbox-list-item"),
            t.classList.add("t-text"),
            a) {
            case "pickup":
                d = e.name,
                n = e.address;
                var r = "";
                e.cash && "n" === e.cash && (r += "cash"),
                t.dataset.restrictions = r;
                break;
            case "address":
                if (e.fullName) {
                    d = e.fullName.split(",").reverse()[0];
                    var s = e.fullName;
                    (s = s.split(",").reverse()).shift(),
                    s = s.join(", "),
                    n = s
                } else
                    d = e.name,
                    n = ""
            }
            t.dataset.name = e.name,
            t.dataset.fullName = e.fullName || "",
            t.dataset.postalcode = e.postalCode,
            t.dataset.guid = e.guid || "",
            t.dataset.pickupid = e.id || "",
            t.dataset.shortname = e.shortName || "",
            t.dataset.address = e.address || "",
            t.dataset.hasStreets = e.hasStreets,
            e.hasHousesWithoutStreets && (t.dataset.hasHousesWithoutStreets = !0),
            t.dataset.coordinates = e.coordinates || "",
            t.dataset.countryIso = e.countryIso || "";
            var l = document.createElement("div");
            l.classList.add("searchbox-list-item-text"),
            l.appendChild(document.createTextNode(d)),
            t.appendChild(l),
            (o = document.createElement("div")).classList.add("searchbox-list-item-description"),
            o.appendChild(document.createTextNode(n)),
            t.appendChild(o),
            i.appendChild(t)
        }
        )),
        t.innerHTML = "",
        t.appendChild(i),
        t.scrollTop = 0
    },
    showPickupInfo: function e(t, r) {
        var a = r.querySelector(".searchbox-info"), i;
        r.classList.add("show-info"),
        this.deliveryState.pickupList.forEach((function(e) {
            e.id != t || (i = e)
        }
        ));
        var o = i.name
          , d = i.address || ""
          , n = i.workTime || ""
          , s = i.phones || ""
          , l = i.addressComment || ""
          , c = "";
        c += '<p style="font-weight: 400; margin-bottom: 15px;" class="t-text">' + t_delivery__dict("pickup") + ":</p>",
        c += '<p class="t-text">' + o + "</p>",
        c += '<p class="t-text">' + t_delivery__dict("address") + ": " + d + "</p>",
        l && (c += '<p class="t-text" style="opacity: 0.6; line-height: 22px; font-size: .9rem;">' + l + "</p>"),
        c += n ? '<p class="t-text">' + t_delivery__dict("workingHours") + ": " + n + "</p>" : "",
        s.length && (c += s.length > 1 ? '<p class="t-text">' + t_delivery__dict("phones") + ": " + s.join(", ") + "</p>" : '<p class="t-text">' + t_delivery__dict("phone") + ": " + s.join(", ") + "</p>"),
        c += '<span style="border-bottom: 1px dashed #000; font-weight: 400; margin-top: 10px; display: inline-block; cursor: pointer;" class="t-text searchbox-change-pickup">' + t_delivery__dict("change") + "</span>",
        a.innerHTML = c
    },
    renderServices: function e(t, r) {
        this.deliveryState.services = {},
        this.deliveryState.postalCode = {};
        var a = document.getElementById("delivery-services-wrapper");
        a && (a.innerHTML = "");
        var i = document.getElementById("addresses-wrapper");
        i && i.parentNode && i.parentNode.removeChild(i);
        var o = this.deliveryState.cityPostalCode || ""
          , d = this
          , n = this.deliveryState.currencyCode
          , s = document.querySelector(".t706 #city-searchbox input")
          , l = document.querySelector(".t706")
          , c = l.querySelectorAll(".t706 .t706__cartwin-products, .t706 .t706__orderform")
          , u = l.querySelector(".t-radio__wrapper-delivery")
          , p = function e(t) {
            if (t.error) {
                var i = window.t_delivery__browserLang.toLowerCase()
                  , o = t.userFriendlyError ? t.userFriendlyError[i] ? t.userFriendlyError[i] : t.userFriendlyError.en : "";
                return window.tcart.emptyDeliveryServices = !0,
                tcart__errorHandler.show(o || t.error),
                s.classList.remove("load"),
                s.readOnly = !1,
                void tcart__updateDelivery()
            }
            0 === t.length ? (window.tcart.emptyDeliveryServices = !0,
            d.deliveryState.activeServiceUid = null,
            tcart__errorHandler.show(t_delivery__dict("deliveryNotPossible")),
            s.classList.remove("load"),
            s.readOnly = !1) : window.tcart.emptyDeliveryServices = !1;
            var n = document.querySelectorAll(".t706 #delivery-services-wrapper .t-radio__control");
            if (Array.prototype.forEach.call(n, (function(e) {
                e && e.parentNode && e.parentNode.removeChild(e)
            }
            )),
            Array.isArray(t)) {
                var l = [];
                t.forEach((function(e) {
                    l.push(parseInt(e.id, 10))
                }
                ));
                var u, p = d.deliveryState.activeServiceUid;
                -1 === l.indexOf(p) && (d.deliveryState.activeServiceUid = null),
                t.forEach((function(e, r) {
                    if (e.currency && e.currency !== d.deliveryState.currencyCode)
                        return console.error(e.title + ": wrong delivery currency (" + e.currency + ")"),
                        void (t.length === r + 1 && (Array.prototype.forEach.call(c, (function(e) {
                            e.style.pointerEvents = ""
                        }
                        )),
                        s.classList.remove("load"),
                        s.readOnly = !1));
                    d.deliveryState.services[e.id] = {},
                    d.deliveryState.services[e.id].fields = e.fields,
                    d.deliveryState.services[e.id].strongAddress = e.strongAddress;
                    var a = "";
                    "n" === e.cash && (a += "cash");
                    var i = !1;
                    0 === r && (i = !0);
                    var o = d.createRadio({
                        title: e.title,
                        minimumTime: e.minimumDeliverTime,
                        minimumPrice: e.minimumPrice,
                        staticPrice: e.staticPrice,
                        deliveryType: e.type,
                        serviceId: e.id,
                        hint: e.hint,
                        hash: e.hash,
                        restrictions: a,
                        checkedStatus: i,
                        freeDeliveryThreshold: e.freeDeliveryThreshold
                    });
                    document.getElementById("delivery-services-wrapper").appendChild(o)
                }
                ))
            }
            tcart__updateDelivery(),
            d.changeDeliveryTypeListener(),
            t_triggerEvent(a, "renderDeliveryServices");
            var v = document.getElementById("delivery-services-wrapper").querySelector('input[name="tildadelivery-type"]:checked');
            v && t_triggerEvent(v, "change"),
            Array.prototype.forEach.call(c, (function(e) {
                e.style.pointerEvents = ""
            }
            )),
            tcart__showDeliveryPrice(),
            "function" == typeof r && r()
        };
        d.getServices(d.deliveryState.projectId, o, n, p, (function(e) {
            if (0 === d.deliveryState.badResponseCounters.services)
                return d.deliveryState.badResponseCounters.services++,
                void setTimeout((function() {
                    d.renderServices(t)
                }
                ), 2500);
            d.deliveryState.badResponseCounters.services > 0 && d.changeEndpoint(e, (function() {
                d.getServices(d.deliveryState.projectId, o, n, p, (function() {
                    tcart__preloader.hide(),
                    d.showUnavailableMessage(u)
                }
                ))
            }
            ), (function() {
                tcart__preloader.hide(),
                d.showUnavailableMessage(u)
            }
            ))
        }
        ))
    },
    getCityFromGeo: function e(t, r, a) {
        var i = {
            projectId: t
        };
        if (!window.dev) {
            var o = sessionStorage.getItem("tCityFromGeo");
            if (null !== o)
                try {
                    return void r(JSON.parse(o))
                } catch (u) {}
        }
        var d = document.getElementById("allrecords")
          , n = d.getAttribute("data-tilda-project-lang");
        n && (i.lang = n);
        var s = d.getAttribute("data-tilda-root-zone");
        s && (i.rz = s),
        i = JSON.stringify(i);
        var l = new XMLHttpRequest;
        l.onload = function() {
            l.readyState === l.DONE && 200 === l.status && (window.dev || sessionStorage.setItem("tCityFromGeo", l.responseText),
            r(JSON.parse(l.responseText)))
        }
        ,
        "function" == typeof a && (l.ontimeout = l.onerror = function(e) {
            l.isTimeout = "timeout" === e.type,
            a(l)
        }
        );
        var c = this;
        c.endpointDelivery || (c.endpointDelivery = ".tildacdn.com"),
        l.open("POST", "https://geoserv" + c.endpointDelivery + "/api/detect-city/"),
        l.timeout = 3e4,
        l.send(i)
    },
    getPayTypes: function e() {
        var t = document.getElementById("customdelivery"), r;
        if (t && (r = t.getAttribute("data-paytypes")),
        t) {
            if (r)
                try {
                    r = JSON.parse(r)
                } catch (o) {}
            if (!r || "object" != typeof r && "function" != typeof r) {
                r = {};
                var a = document.querySelectorAll(".t706 input[name=paymentsystem]");
                if (Array.prototype.forEach.call(a, (function(e) {
                    "cash" === e.value ? r.cash = "y" : "banktransfer" === e.value ? r.banktransfer = "y" : r.card = "y"
                }
                )),
                !r.card && !r.cash && !r.banktransfer) {
                    var i = document.querySelector(".t706").getAttribute("data-payment-system");
                    "cash" == i ? r.cash = "y" : "banktransfer" == i ? r.banktransfer = "y" : i && "" != i && "none" != i ? r.card = "y" : r.none = "y"
                }
                t.setAttribute("data-paytypes", JSON.stringify(r))
            }
            return r
        }
    },
    getServices: function e(t, r, a, i, o) {
        tcart__blockSubmitButton(),
        this.updateTotal();
        var d = window.tcart.total || 0;
        if (void 0 === d || d < 1)
            i({
                error: new Error("RU" === window.t_delivery__browserLang ? "добавьте в корзину хотя бы один товар" : "add at least one product")
            });
        else {
            var n = window.tcart.prodamount || 0;
            window.tcart.prodamount_withdiscount || 0 === window.tcart.prodamount_withdiscount ? n = window.tcart.prodamount_withdiscount : window.t_cart__discounts && window.t_cart__discounts.length > 0 && void 0 !== window.tcart.prodamount_withdyndiscount && (n = window.tcart.prodamount_withdyndiscount);
            var s = this.removeEmptyOrDeletedProducts()
              , l = document.getElementById("delivery-services-wrapper");
            l && (l.style.display = "none",
            tcart__preloader.show(l, t_delivery__dict("loadingServices"))),
            tcart__hideDeliveryPrice();
            var c = {
                action: "list",
                projectId: t,
                postalCode: r || 0,
                currency: a,
                itemsCount: d,
                cartAmount: n,
                geoData: this.deliveryState.geoData || {},
                products: s,
                paytypes: this.getPayTypes()
            }
              , u = document.getElementById("allrecords")
              , p = u.getAttribute("data-tilda-project-lang");
            p && (c.lang = p);
            var v = u.getAttribute("data-tilda-root-zone");
            v && (c.rz = v),
            c = JSON.stringify(c);
            var y = new XMLHttpRequest;
            y.onload = function() {
                tcart__preloader.hide(),
                l && (l.style.display = ""),
                y.readyState === y.DONE && 200 === y.status && i(JSON.parse(y.responseText))
            }
            ,
            "function" == typeof o && (y.ontimeout = y.onerror = function(e) {
                y.isTimeout = "timeout" === e.type,
                o(y)
            }
            );
            var m = this;
            m.endpointDelivery || (m.endpointDelivery = ".tildacdn.com"),
            y.open("POST", "https://delivery" + m.endpointDelivery + "/cart-api/"),
            y.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8"),
            y.timeout = 3e4,
            y.send(c)
        }
    },
    getPickupList: function e(t) {
        tcart__blockSubmitButton(),
        this.updateTotal();
        var r = window.tcart.total || 0;
        if (void 0 === r || r < 1)
            t.onDone({
                error: new Error("RU" === window.t_delivery__browserLang ? "добавьте в корзину хотя бы один товар" : "add at least one product")
            });
        else {
            var a = window.tcart.prodamount || 0;
            window.tcart.prodamount_withdiscount || 0 === window.tcart.prodamount_withdiscount ? a = window.tcart.prodamount_withdiscount : window.t_cart__discounts && window.t_cart__discounts.length > 0 && void 0 !== window.tcart.prodamount_withdyndiscount && (a = window.tcart.prodamount_withdyndiscount);
            var i = this.removeEmptyOrDeletedProducts()
              , o = {
                action: "pickup-list",
                projectId: t.projectId,
                postalCode: t.postalCode || 0,
                deliveryId: t.deliveryId,
                pattern: t.pattern,
                itemsCount: r,
                cartAmount: a,
                geoData: this.deliveryState.geoData || {},
                products: i,
                paytypes: this.getPayTypes()
            }
              , d = document.getElementById("allrecords")
              , n = d.getAttribute("data-tilda-project-lang");
            n && (o.lang = n);
            var s = d.getAttribute("data-tilda-root-zone");
            s && (o.rz = s),
            o = JSON.stringify(o);
            var l = new XMLHttpRequest;
            l.onload = function() {
                l.readyState === l.DONE && 200 === l.status && t.onDone(JSON.parse(l.responseText)),
                tcart__updateDelivery()
            }
            ,
            "function" == typeof t.onFail && (l.ontimeout = l.onerror = function(e) {
                l.isTimeout = "timeout" === e.type,
                t.onFail(l)
            }
            );
            var c = this;
            c.endpointDelivery || (c.endpointDelivery = ".tildacdn.com"),
            l.open("POST", "https://delivery" + c.endpointDelivery + "/cart-api/"),
            l.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8"),
            l.timeout = 3e4,
            l.send(o)
        }
    },
    getDeliveryPrice: function e(t) {
        tcart__hideDeliveryPrice(),
        tcart__blockSubmitButton(),
        this.updateTotal();
        var r = window.tcart.total || 0;
        if (void 0 === r || r < 1)
            t.onDone({
                error: new Error("RU" === window.t_delivery__browserLang ? "добавьте в корзину хотя бы один товар" : "add at least one product")
            });
        else {
            var a = window.tcart.prodamount || 0;
            window.tcart.prodamount_withdiscount || 0 === window.tcart.prodamount_withdiscount ? a = window.tcart.prodamount_withdiscount : window.t_cart__discounts && window.t_cart__discounts.length > 0 && void 0 !== window.tcart.prodamount_withdyndiscount && (a = window.tcart.prodamount_withdyndiscount);
            var i = this.removeEmptyOrDeletedProducts()
              , o = {
                action: "calculate",
                projectId: t.projectId,
                postalCode: t.postalCode,
                deliveryId: t.serviceId,
                currency: this.deliveryState.currencyCode,
                itemsCount: r,
                cartAmount: a,
                pickupPointId: t.pickupPointId,
                products: i,
                guid: this.deliveryState.cityGuid || 0
            };
            o = JSON.stringify(o);
            var d = new XMLHttpRequest;
            d.onload = function() {
                d.readyState === d.DONE && 200 === d.status && t.onDone(JSON.parse(d.responseText)),
                tcart__updateDelivery()
            }
            ,
            "function" == typeof t.onFail && (d.ontimeout = d.onerror = function(e) {
                d.isTimeout = "timeout" === e.type,
                t.onFail(d)
            }
            );
            var n = this;
            n.endpointDelivery || (n.endpointDelivery = ".tildacdn.com"),
            d.open("POST", "https://delivery" + n.endpointDelivery + "/cart-api/"),
            d.timeout = 3e4,
            d.send(o)
        }
    },
    getCityCoordinates: function e(t, r, a) {
        var i = new XMLHttpRequest;
        i.onload = function() {
            i.readyState === i.DONE && 200 === i.status && a(JSON.parse(i.responseText))
        }
        ,
        i.open("GET", "https://geocode-maps.yandex.ru/1.x/?apikey=" + this.deliveryState.ymapApiKey + "&format=json&geocode=" + r),
        i.timeout = 3e4,
        i.send()
    },
    getAddresses: function e(t, r, a, i) {
        var o = this;
        o.deliveryState.currentRequest && o.deliveryState.currentRequest.abort(),
        o.endpointDelivery || (o.endpointDelivery = ".tildacdn.com");
        var d = {
            street: "https://geoserv" + o.endpointDelivery + "/api/address/",
            city: "https://geoserv" + o.endpointDelivery + "/api/city/",
            pickup: "https://delivery" + o.endpointDelivery + "/cart-api/",
            house: "https://geoserv" + o.endpointDelivery + "/api/house/"
        }
          , n = "";
        try {
            var s = JSON.parse(t);
            if (n = "t" + r + "_" + s.pattern.toLowerCase(),
            void 0 !== s.fias && (n += "_" + s.fias),
            void 0 === window.dev) {
                var l = sessionStorage.getItem(n);
                if (null !== l)
                    try {
                        return void a(JSON.parse(l))
                    } catch (y) {}
            }
            var c = document.getElementById("allrecords")
              , u = c.getAttribute("data-tilda-project-lang");
            u && (s.lang = u,
            t = JSON.stringify(s));
            var p = c.getAttribute("data-tilda-root-zone");
            p && (s.rz = p,
            t = JSON.stringify(s))
        } catch (y) {}
        var v = new XMLHttpRequest;
        v.onload = function() {
            v.readyState === v.DONE && 200 === v.status && (window.dev || sessionStorage.setItem(n, v.responseText),
            a(JSON.parse(v.responseText))),
            tcart__updateDelivery(),
            o.deliveryState.currentRequest = null
        }
        ,
        "function" == typeof i && (v.ontimeout = v.onerror = function(e) {
            v.isTimeout = "timeout" === e.type,
            i(v),
            o.deliveryState.currentRequest = null
        }
        ),
        d[r] && v.open("POST", d[r]),
        v.timeout = 3e4,
        v.send(t),
        o.deliveryState.currentRequest = v
    },
    createInput: function e(t, r, a, i, o, d, n, s, l, c, u, p, v) {
        r = r || "",
        a = a || "",
        o = o || "",
        d = d || "",
        t = t || "",
        p = p || "",
        i = i || "",
        v = v || "",
        u = u ? 1 : 0,
        n = n + " t-input" || "t-input";
        var y = document.createElement("div");
        y.classList.add("t-input-group"),
        y.classList.add("t-input-group_in"),
        c && (y.style.cssText = c),
        l && y.setAttribute("hidden", ""),
        y.setAttribute("data-input-lid", "");
        var m = document.createElement("div");
        m.classList.add("t-input-title"),
        m.classList.add("t-descr"),
        m.classList.add("t-descr_md"),
        m.setAttribute("data-redactor-toolbar", "no"),
        m.setAttribute("field", ""),
        m.appendChild(document.createTextNode(r)),
        y.appendChild(m);
        var h = document.createElement("div");
        h.classList.add("t-input-block");
        var f = document.createElement("input");
        if (n.split(" ").forEach((function(e) {
            "" !== e && f.classList.add(e)
        }
        )),
        v && f.setAttribute("data-tilda-rule", v),
        p && f.setAttribute("inputmode", p),
        t && f.setAttribute("type", t),
        f.setAttribute("data-service-id", d),
        f.name = s.toLowerCase(),
        f.value = i,
        f.placeholder = a,
        f.autocomplete = -1 !== navigator.userAgent.search(/Chrome/) ? "no" : "off",
        f.setAttribute("data-tilda-req", u),
        f.dataset.tildaReq = u,
        h.appendChild(f),
        "hidden" !== t) {
            var _ = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            _.setAttribute("viewBox", "0 0 88 88"),
            _.classList.add("t706__search-icon");
            var S = document.createElementNS("http://www.w3.org/2000/svg", "path");
            S.setAttribute("d", "M85 31.1c-.5-8.7-4.4-16.6-10.9-22.3C67.6 3 59.3 0 50.6.6c-8.7.5-16.7 4.4-22.5 11-11.2 12.7-10.7 31.7.6 43.9l-5.3 6.1-2.5-2.2-17.8 20 9 8.1 17.8-20.2-2.1-1.8 5.3-6.1c5.8 4.2 12.6 6.3 19.3 6.3 9 0 18-3.7 24.4-10.9 5.9-6.6 8.8-15 8.2-23.7zM72.4 50.8c-9.7 10.9-26.5 11.9-37.6 2.3-10.9-9.8-11.9-26.6-2.3-37.6 4.7-5.4 11.3-8.5 18.4-8.9h1.6c6.5 0 12.7 2.4 17.6 6.8 5.3 4.7 8.5 11.1 8.9 18.2.5 7-1.9 13.8-6.6 19.2z"),
            S.setAttribute("fill", "#3f3f3f"),
            _.appendChild(S),
            h.appendChild(_);
            var g = document.createElement("div");
            g.classList.add("t-input-clear"),
            h.appendChild(g)
        }
        var b = document.createElement("div");
        b.classList.add("t-input-description"),
        b.classList.add("t-text"),
        b.classList.add("t-text_xs"),
        b.style.cssText = "color: #505050; margin: 5px 0 0;",
        h.appendChild(b);
        var w = document.createElement("div");
        return w.classList.add("t-input-error"),
        h.appendChild(w),
        y.appendChild(h),
        y
    },
    createRadio: function e(t) {
        var r = t.title || ""
          , a = t.minimumTime || ""
          , i = t.minimumPrice || ""
          , o = t.staticPrice || 0
          , d = t.deliveryType
          , n = t.serviceId
          , s = t.hint || ""
          , l = t.hash || ""
          , c = t.restrictions || ""
          , u = t.checkedStatus
          , p = t.freeDeliveryThreshold || ""
          , v = (t.classes || "") + " t-radio__control t-text t-text_xs"
          , y = document.createElement("label");
        y.setAttribute("data-service-id", n),
        v.split(" ").forEach((function(e) {
            "" !== e && y.classList.add(e)
        }
        ));
        var m = document.createElement("input"), h, f = tcart_newDelivery.deliveryState.activeServiceUid, _ = f === parseInt(t.serviceId, 10);
        (u && !f || _) && (m.checked = !0),
        m.setAttribute("data-delivery-price", i),
        c && (m.dataset.restrictions = c),
        p && m.setAttribute("data-free-delivery-threshold", p),
        l && m.setAttribute("data-hash-value", l),
        (o || 0 == o) && (m.setAttribute("data-delivery-price", o),
        m.setAttribute("data-static-price", o)),
        m.setAttribute("data-service-id", t.serviceId),
        m.setAttribute("data-delivery-type", d),
        m.setAttribute("type", "radio"),
        m.setAttribute("name", "tildadelivery-type"),
        m.classList.add("t-radio"),
        m.classList.add("t-radio_delivery"),
        m.classList.add("js-tilda-rule"),
        m.setAttribute("data-tilda-req", 1),
        m.dataset.tildaReq = 1,
        m.setAttribute("value", r),
        s && m.setAttribute("data-hint-text", s),
        y.appendChild(m);
        var S = document.createElement("div");
        S.classList.add("t-radio__indicator"),
        S.style.cssText = "border-color: #000;",
        y.appendChild(S);
        var g = document.createElement("span");
        g.classList.add("delivery-checkbox-label"),
        g.appendChild(document.createTextNode(r)),
        y.appendChild(g);
        var b = t_delivery__declensionOfNumber(a), w, w;
        a && ((w = document.createElement("span")).classList.add("delivery-minimum-time"),
        w.innerHTML = t_delivery__dict("from") + " " + a + " " + b,
        y.appendChild(w));
        if (o)
            (w = document.createElement("span")).classList.add("delivery-minimum-price"),
            w.innerHTML = t_delivery__showPrice(o),
            y.appendChild(w);
        else if (i) {
            var w;
            (w = document.createElement("span")).classList.add("delivery-minimum-price"),
            w.innerHTML = t_delivery__dict("from") + " " + t_delivery__showPrice(i),
            y.appendChild(w)
        }
        return y
    },
    createTitle: function e(t, r) {
        t = t || "",
        r = r || "";
        var a = document.createElement("div");
        return a.style.margin = "20px 0",
        a.classList.add("t-name"),
        a.classList.add("t-name_md"),
        r.split(" ").forEach((function(e) {
            "" !== e && a.classList.add(e)
        }
        )),
        a.appendChild(document.createTextNode(t)),
        a
    },
    createSelect: function e(t, r, a, i, o) {
        t = t || "",
        r = r || "";
        var d = "";
        return d += '<label class="t-input-title t-descr t-descr_md">Пункт выдачи</label>',
        d += '<div class="ss-select delivery-pickup-select">',
        d += '<select class="ss-input ss-select delivery-select" data-service-id="' + i + '" name="' + (o = o || "") + '">',
        d += '<option data-point-id="">Не выбран</option>',
        a.forEach((function(e) {
            d += "<option data-point-id=" + e.id + ">" + e.address + "</option>"
        }
        )),
        d += "</select>",
        d += "</div>"
    },
    changeDeliveryTypeListener: function e() {
        var t = this
          , r = document.querySelectorAll(".t706 input[data-delivery-type]");
        Array.prototype.forEach.call(r, (function(e) {
            e.addEventListener("change", (function() {
                var e = parseInt(this.getAttribute("data-service-id"), 10) || 0
                  , r = parseInt(this.getAttribute("data-free-delivery-threshold"), 10);
                t.deliveryState.freeDeliveryThreshold = r || 0,
                t.deliveryState.activeServiceUid = e,
                tcart__errorHandler.hide(),
                t.renderAddressFields(this),
                this.dataset.hashValue && t.setHashInput(this.dataset.hashValue),
                t.hidePaymentMethod(this);
                var a = document.querySelectorAll(".t706 input[data-delivery-type]");
                Array.prototype.forEach.call(a, (function(e) {
                    var t = e.getAttribute("data-static-price") || e.getAttribute("data-delivery-price");
                    t > 0 ? e.setAttribute("data-delivery-price", t) : e.setAttribute("data-delivery-price", "")
                }
                )),
                t.hints.deleteAll(),
                t.deliveryState.fullNames.pickup = null,
                t.deliveryState.fullNames.street = null,
                t.deliveryState.fullNames.house = null,
                t.deliveryState.searchboxes["pickup-searchbox"] && (t.deliveryState.searchboxes["pickup-searchbox"] = null),
                this.getAttribute("data-hint-text") && t.hints.render(this.getAttribute("data-hint-text")),
                tcart__updateDelivery()
            }
            ), !1)
        }
        ))
    },
    hidePaymentMethod: function e(t) {
        var r = document.querySelector('.t706 [data-payment-variant-system="cash"]');
        if (r) {
            var a = r.parentNode, i, o = a.closest(".t-radio__wrapper-payment").querySelector('[data-payment-variant-system]:not([data-payment-variant-system="cash"])');
            "cash" === t.dataset.restrictions && r ? (a.style.display = "none",
            o.checked = !0,
            o && t_triggerEvent(o, "change")) : a.style.display = ""
        }
    },
    removePriceValueInRadio: function e(t) {
        var r = document.querySelector('.t706 input.t-radio_delivery[data-service-id="' + t + '"]');
        r && (r.removeAttribute("data-delivery-price"),
        tcart__updateDelivery(),
        tcart__hideDeliveryPrice())
    },
    updatePriceValueInRadio: function e(t, r) {
        var a = document.querySelector('.t706 input.t-radio_delivery[data-service-id="' + r + '"]')
          , i = document.querySelector('.t706 input.t-radio_delivery[data-service-id="' + r + '"] ~ span.delivery-minimum-price');
        a && (a.setAttribute("data-delivery-price", t),
        tcart__updateDelivery(),
        tcart__showDeliveryPrice()),
        i && (i.innerHTML = t_delivery__showPrice(t))
    },
    changePickupHandler: function e(t, r, a, i, o, d) {
        var n = i.querySelector(".searchbox-input")
          , s = n.getAttribute("data-service-id")
          , l = this;
        a = a || this.deliveryState.city.postalCode,
        n.setAttribute("data-pickup-id", t),
        n.setAttribute("data-pickup-address", o),
        n.value = r;
        var c = function e(r) {
            var a = r.price;
            if (r.error || 0 === r.length) {
                var i = window.t_delivery__browserLang.toLowerCase()
                  , o = r.userFriendlyError ? r.userFriendlyError[i] ? r.userFriendlyError[i] : r.userFriendlyError.en : "";
                return tcart__errorHandler.show(o || r.error),
                window.tcart.emptyDeliveryServices = !0,
                void tcart__updateDelivery()
            }
            window.tcart.emptyDeliveryServices = !1,
            tcart__errorHandler.hide(),
            void 0 !== r.hash && l.setHashInput(r.hash),
            t || (a = 0),
            l.updatePriceValueInRadio(a, s),
            l.setFullAddress(l.getFullAddress())
        }, u;
        l.getDeliveryPrice({
            projectId: l.deliveryState.projectId,
            postalCode: a,
            serviceId: s,
            pickupPointId: t,
            onDone: c,
            onFail: function e(r) {
                l.changeEndpoint(r, (function() {
                    l.getDeliveryPrice({
                        projectId: l.deliveryState.projectId,
                        postalCode: a,
                        serviceId: s,
                        pickPointId: t,
                        onDone: c,
                        onFail: function e() {
                            var t = "";
                            t = "RU" === window.t_delivery__browserLang ? 'Невозможно получить почтовый индекс для доставки. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a postal code for delivery. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get a postal code for street" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
                            tcart__errorHandler.show("Request failed: " + t),
                            window.tcart.emptyDeliveryServices = !0,
                            tcart__updateDelivery()
                        }
                    })
                }
                ))
            }
        }),
        d && (u = 0 == d[0] && 0 == d[1]),
        d && window.t_delivery__map && !u && window.t_delivery__map.setCenter(d, 16)
    },
    renderAddressFields: function e(t) {
        this.disableChoseServiceControls(),
        tcart__blockSubmitButton();
        var r = this
          , a = document.getElementById("customdelivery")
          , i = t.getAttribute("data-service-id")
          , o = document.getElementById("addresses-wrapper");
        o && o.parentNode && o.parentNode.removeChild(o),
        a.setAttribute("data-service-id", i);
        var d = document.createElement("div");
        d.id = "addresses-wrapper",
        a.appendChild(d);
        var n = t.getAttribute("data-delivery-type")
          , s = document.querySelector(".t706 #city-searchbox input");
        switch (delete r.deliveryState.pickupPointId,
        n) {
        case "pickup":
            tcart__preloader.show(document.getElementById("addresses-wrapper"), t_delivery__dict("loadingPickup")),
            window.tcart.emptyDeliveryServices = !1;
            var l = ""
              , c = document.querySelector('.t706 input.t-radio_delivery[data-service-id="' + i + '"]');
            c && (l = c.dataset.restrictions || "");
            var u = function e(t) {
                if (tcart__preloader.hide(),
                t.error) {
                    var a = window.t_delivery__browserLang.toLowerCase()
                      , n = t.userFriendlyError ? t.userFriendlyError[a] ? t.userFriendlyError[a] : t.userFriendlyError.en : "";
                    return tcart__errorHandler.show(n || t.error),
                    window.tcart.emptyDeliveryServices = !0,
                    r.enableChoseServiceControls(),
                    s.classList.remove("load"),
                    s.readOnly = !1,
                    void tcart__updateDelivery()
                }
                t = t.map((function(e) {
                    return "cash" === l && (e.cash = "n"),
                    e
                }
                ));
                var c = document.getElementById("pickup-searchbox");
                c && c.parentNode && c.parentNode.removeChild(c);
                var u = r.createInput("", t_delivery__dict("pickup"), t_delivery__dict("selectPickup"), null, null, i, "searchbox-input js-tilda-rule", "tildadelivery-pickup-name", null, null, !0, null, "chosevalue")
                  , p = r.createSearchbox(u, "pickup-searchbox");
                if (o = document.getElementById("addresses-wrapper")) {
                    if (o.appendChild(p),
                    r.deliveryState.searchboxes["pickup-searchbox"] = {},
                    r.deliveryState.searchboxes["pickup-searchbox"].autocompleteAddress = t,
                    r.deliveryState.pickupList = t,
                    r.deliveryState.ymapApiKey && r.mapInit("yandex"),
                    r.searchboxInit("pickup-searchbox", "pickup", null, t),
                    r.renderUserFields(d, i),
                    r.changeCartInputsHandler(),
                    p || (p = document.querySelector(".t706 #pickup-searchbox")),
                    r.deliveryState.ymapApiKey && r.mapAddPoints("", t, p),
                    1 === t.length)
                        try {
                            var v = t[0];
                            r.deliveryState.fullNames.pickup = v.address;
                            var y = v.id
                              , m = v.name || v.address
                              , h = v.postalCode;
                            "" === h && (h = r.deliveryState.cityPostalCode),
                            r.deliveryState.searchboxes["pickup-searchbox"].address = {
                                name: m,
                                pickupid: y,
                                postalCode: h
                            },
                            r.deliveryState.pickupPointId = y,
                            r.deliveryState.postalCode = h,
                            r.setPostalCodeInput(h),
                            r.changePickupHandler(y, m, h, p, v.address, v.coordinates.join());
                            var f = document.querySelector('.t706 [name="tildadelivery-pickup-name"]'), _;
                            f && (f.value = m),
                            r.showPickupInfo(y, p),
                            p.querySelector(".searchbox-input").setAttribute("data-option-selected", !0)
                        } catch (S) {
                            console.log("Error: Failed to change pickup point", S)
                        }
                    r.enableChoseServiceControls(),
                    s.classList.remove("load"),
                    s.readOnly = !1
                }
            };
            r.getPickupList({
                projectId: r.deliveryState.projectId,
                postalCode: r.deliveryState.city.postalCode,
                deliveryId: i,
                onDone: u,
                onFail: function e(t) {
                    r.changeEndpoint(t, (function() {
                        r.getPickupList({
                            projectId: r.deliveryState.projectId,
                            postalCode: r.deliveryState.city.postalCode,
                            deliveryId: i,
                            onDone: u
                        })
                    }
                    ))
                }
            });
            break;
        case "delivery":
            window.tcart.emptyDeliveryServices = !1,
            r.renderUserFields(d, i),
            r.changeCartInputsHandler(),
            r.enableChoseServiceControls(),
            s.classList.remove("load"),
            s.readOnly = !1
        }
    },
    clearHouseInput: function e() {
        var t = document.querySelector('.t706 #customdelivery [name="tildadelivery-house"]');
        t && (t.value = "")
    },
    renderUserFields: function e(t, r) {
        var a = this
          , i = a.deliveryState.services[r].fields
          , o = 0;
        for (var d in i)
            switch (d) {
            case "street":
            case "comment":
            case "userInitials":
                break;
            default:
                o++
            }
        var n = 0;
        for (var s in i) {
            var l = i[s].autocomplete
              , c = ""
              , u = ""
              , p = ""
              , v = ""
              , y = ""
              , m = !0;
            switch (s) {
            case "street":
                c = t_delivery__dict("street"),
                u = "width: 100%",
                m = "false" != a.deliveryState.city.hasStreets,
                a.deliveryState.city.hasHousesWithoutStreets && (m = !1);
                break;
            case "house":
                n++,
                c = t_delivery__dict("house"),
                m = "false" != a.deliveryState.city.hasStreets,
                a.deliveryState.city.hasHousesWithoutStreets && (m = !0);
                break;
            case "entrance":
                n++,
                c = t_delivery__dict("entrance"),
                m = !1;
                break;
            case "floor":
                n++,
                c = t_delivery__dict("floor"),
                p = "number",
                v = "numeric",
                m = !1;
                break;
            case "aptOffice":
                n++,
                c = t_delivery__dict("apt"),
                m = !1;
                break;
            case "phone":
                n++,
                c = t_delivery__dict("phone"),
                p = "number",
                v = "numeric";
                break;
            case "entranceCode":
                n++,
                c = t_delivery__dict("entranceCode"),
                m = !1;
                break;
            case "comment":
                c = t_delivery__dict("comment"),
                u = "width: 100%",
                m = !1,
                y = t_delivery__dict("orderComment");
                break;
            case "oneLineAddress":
                n++,
                c = t_delivery__dict("address");
                break;
            case "userInitials":
                u = "width: 100%",
                c = t_delivery__dict("fullName"),
                y = t_delivery__dict("johnDoe")
            }
            o === n && o % 2 != 0 && (u = "width: 100%"),
            c = c || "";
            var h = "tildadelivery-" + s
              , f = "";
            if (l) {
                m && (f = "chosevalue");
                var _ = this.createInput(p, c, y, "", "", r, "searchbox-input js-tilda-rule", h, !1, u, m, v, f)
                  , S = s + "-searchbox"
                  , g = this.createSearchbox(_, S);
                t.appendChild(g),
                this.searchboxInit(S, s)
            } else {
                "userInitials" === s && (f = "name");
                var b = this.createInput(p, c, y, "", "", r, "js-tilda-rule", h, !1, u, m, v, f);
                t.appendChild(b)
            }
        }
        t_triggerEvent(t, "renderDeliveryAddresses"),
        this.restoreTcartDelivery()
    },
    hints: {
        render: function e(t) {
            var r = document.getElementById("delivery-services-wrapper"), a = document.createElement("div"), i;
            "delivery-hint t-text t-text_xs".split(" ").forEach((function(e) {
                a.classList.add(e)
            }
            )),
            a.setAttribute("id", "delivery-hint"),
            a.appendChild(document.createTextNode(t)),
            r.insertAdjacentElement("afterend", a)
        },
        deleteAll: function e() {
            var t = document.querySelector(".t706 .delivery-hint");
            t && t.parentNode && t.parentNode.removeChild(t)
        }
    },
    showUnavailableMessage: function e(t) {
        var r = this.createInput("hidden", "", "", "nodelivery", null, null, "js-tilda-rule", "delivery-badresponse-comment", null, null, !0, "", "deliveryreq");
        window.tcart && (window.tcart.system = "none");
        var a = document.createElement("div");
        a.style.cssText = "margin: 20px 0; line-height: 22px; color: red;",
        a.classList.add("t-text"),
        a.appendChild(document.createTextNode(t_delivery__dict("unavailable"))),
        t.appendChild(a),
        t.appendChild(r)
    },
    updateTotal: function e() {
        void 0 !== window.tcart.products && 0 !== window.tcart.products.length || void 0 === window.tcart__syncProductsObject__LStoObj || void 0 === window.tcart__updateTotalProductsinCartObj || (tcart__syncProductsObject__LStoObj(),
        tcart__updateTotalProductsinCartObj())
    },
    removeEmptyOrDeletedProducts: function e() {
        var t = [];
        return window.tcart.products.forEach((function(e) {
            "{}" !== JSON.stringify(e) && "yes" !== e.deleted && t.push(e)
        }
        )),
        t
    },
    updateProjectId: function e() {
        var t = this
          , r = [document.getElementById("allrecords"), document.getElementById("t-header"), document.getElementById("t-footer")];
        Array.prototype.forEach.call(r, (function(e) {
            e && !parseInt(t.deliveryState.projectId, 10) && (t.deliveryState.projectId = parseInt(e.getAttribute("data-tilda-project-id"), 10))
        }
        ));
        var a = document.getElementById("tildacopy");
        a && !parseInt(t.deliveryState.projectId, 10) && (t.deliveryState.projectId = parseInt((a.getAttribute("data-tilda-sign") || "").split("#")[0], 10))
    },
    endpointDelivery: ".tildacdn.com",
    changeEndpoint: function e(t, r, a) {
        var i = this;
        "object" == typeof t && (t.status >= 500 || 408 == t.status || 410 == t.status || 429 == t.status || t.isTimeout) && ".tildacdn.com" === i.endpointDelivery ? (i.endpointDelivery = "2.tildacdn.com",
        "function" == typeof r && r()) : (t && t.responseText ? console.log("[" + t.status + "] " + t.responseText + ". Please, try again later.") : t && t.statusText ? console.log("Error [" + t.status + ", " + t.statusText + "]. Please, try again later.") : t && t.status ? console.log("[" + t.status + "] Unknown error. Please, try again later.") : console.log("Unknown error. Please, try again later."),
        "function" == typeof a && a())
    }
}
  , tcart__errorHandler = {
    show: function e(t) {
        var r = document.querySelectorAll(".t706 .js-errorbox-all")
          , a = document.querySelectorAll(".t706 .t-form__errorbox-item.js-rule-error-string");
        t && Array.prototype.forEach.call(a, (function(e) {
            e.innerHTML = t
        }
        )),
        Array.prototype.forEach.call(a, (function(e) {
            "" !== e.textContent && (e.style.display = "block",
            Array.prototype.forEach.call(r, (function(e) {
                e && (e.style.display = "")
            }
            )))
        }
        ))
    },
    hide: function e() {
        var t = document.querySelectorAll(".t706 .js-errorbox-all")
          , r = document.querySelectorAll(".t706 .t-form__errorbox-item.js-rule-error-string");
        Array.prototype.forEach.call(t, (function(e) {
            e && (e.style.display = "none")
        }
        )),
        Array.prototype.forEach.call(r, (function(e) {
            e && (e.style.display = "none")
        }
        )),
        Array.prototype.forEach.call(r, (function(e) {
            e.innerHTML = ""
        }
        ))
    }
}
  , tcart__inputErrorHandler = {
    show: function e(t, r) {
        var a = t.closest(".t-input-group"), i;
        a && (a.querySelector(".t-input-error").textContent = r,
        a.classList.add("js-error-control-box"))
    },
    hide: function e(t) {
        var r = t.closest(".t-input-group"), a;
        r && (r.querySelector(".t-input-error").textContent = "",
        r.classList.remove("js-error-control-box"))
    }
};
function tcart__hideDeliveryPrice() {
    var e = document.querySelector(".t706 .t706__cartwin-totalamount-info");
    e && (e.style.opacity = 0);
    var t = document.querySelector(".t706 .delivery-full-address");
    t && (t.style.opacity = 0)
}
function tcart__showDeliveryPrice() {
    var e = document.querySelector(".t706 .t706__cartwin-totalamount-info");
    e && (e.style.opacity = 1);
    var t = document.querySelector(".t706 .delivery-full-address");
    t && (t.style.opacity = 1)
}
var tcart__preloader = {
    show: function e(t, r) {
        if (t) {
            var a = document.getElementById("customdelivery");
            if (a && !a.querySelector(".tcart__preloader")) {
                var i = document.createElement("div");
                if (i.classList.add("tcart__preloader"),
                i.style.cssText = "margin: 20px 0;",
                r) {
                    var o = document.createElement("div");
                    o.classList.add("t-text"),
                    i.style.cssText = "text-align: center; opacity: .5; font-size: 15px;",
                    o.appendChild(document.createTextNode(r)),
                    i.appendChild(o)
                }
                var d = document.createElement("div");
                d.classList.add("lds-ellipsis"),
                d.appendChild(document.createElement("div")),
                d.appendChild(document.createElement("div")),
                d.appendChild(document.createElement("div")),
                d.appendChild(document.createElement("div")),
                i.appendChild(d),
                t.insertAdjacentElement("beforebegin", i)
            }
        }
    },
    hide: function e() {
        var t = document.querySelector(".t706 .tcart__preloader");
        t && t.parentNode && t.parentNode.removeChild(t)
    }
};
function tcart__rerenderDeliveryServices() {
    clearTimeout(window.rerenderTimer),
    window.rerenderTimer = setTimeout((function() {
        var e = document.querySelectorAll(".t706__cartwin-content .t706__product, .t706__cartwin-content .t-form__inputsbox");
        Array.prototype.forEach.call(e, (function(e) {
            e.style.pointerEvents = "none"
        }
        )),
        tcart__blockSubmitButton();
        var t = !1
          , r = tcart_newDelivery
          , a = r.deliveryState
          , i = a.services
          , o = a.activeServiceUid
          , d = a.pickupPointId;
        if (!o)
            return Array.prototype.forEach.call(e, (function(e) {
                e.style.pointerEvents = ""
            }
            )),
            void (0 === Object.keys(r.deliveryState.services).length && r.renderServices(a.postalCode));
        var n = []
          , s = [];
        if (Object.keys(i).forEach((function(e) {
            n.push(parseInt(e, 10))
        }
        )),
        r.updateProjectId(),
        !parseInt(a.projectId, 10)) {
            var l = "";
            return l = "RU" === window.t_delivery__browserLang ? 'Невозможно получить сервисы доставок. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get delivery services" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a delivery services. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get delivery services" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
            tcart__errorHandler.show(l),
            window.tcart.emptyDeliveryServices = !0,
            void tcart__updateDelivery()
        }
        var c = function i(c) {
            if (Array.isArray(c) && (c.forEach((function(e) {
                s.push(parseInt(e.id, 10))
            }
            )),
            s.sort((function(e, t) {
                return e - t
            }
            ))),
            n.sort((function(e, t) {
                return e - t
            }
            )),
            t = JSON.stringify(s) !== JSON.stringify(n))
                -1 !== s.indexOf(o) ? r.renderServices(a.postalCode, (function() {
                    var e = document.querySelector('.t706 input[data-service-id="' + o + '"]');
                    e.checked = !0,
                    t_triggerEvent(e, "change")
                }
                )) : r.renderServices(a.postalCode);
            else {
                var u = document.querySelectorAll(".t706 #delivery-services-wrapper .t-radio__control"), p;
                Array.prototype.forEach.call(u, (function(e) {
                    e && e.parentNode && e.parentNode.removeChild(e)
                }
                )),
                Array.isArray(c) && c.forEach((function(e) {
                    if (e.currency && e.currency !== r.deliveryState.currencyCode)
                        console.error(e.title + ": wrong delivery currency (" + e.currency + ")");
                    else {
                        r.deliveryState.services[e.id] = {},
                        r.deliveryState.services[e.id].fields = e.fields,
                        r.deliveryState.services[e.id].strongAddress = e.strongAddress;
                        var t = "";
                        "n" === e.cash && (t += "cash");
                        var a = !1;
                        parseInt(e.id, 10) === o && (a = !0);
                        var i = r.createRadio({
                            title: e.title,
                            minimumTime: e.minimumDeliverTime,
                            minimumPrice: e.minimumPrice,
                            staticPrice: e.staticPrice,
                            deliveryType: e.type,
                            serviceId: e.id,
                            hint: e.hint,
                            hash: e.hash,
                            restrictions: t,
                            checkedStatus: a,
                            freeDeliveryThreshold: e.freeDeliveryThreshold
                        });
                        document.getElementById("delivery-services-wrapper").appendChild(i)
                    }
                }
                )),
                p = "object" == typeof a.postalCode ? a.cityPostalCode : a.postalCode;
                var v = function t(a) {
                    if (a.error) {
                        window.tcart.emptyDeliveryServices = !0;
                        var i = window.t_delivery__browserLang.toLowerCase()
                          , d = a.userFriendlyError ? a.userFriendlyError[i] ? a.userFriendlyError[i] : a.userFriendlyError.en : "";
                        tcart__errorHandler.show(d || a.error)
                    } else
                        window.tcart.emptyDeliveryServices = !1,
                        tcart__errorHandler.hide();
                    if (void 0 !== a.hash && r.setHashInput(a.hash),
                    void 0 !== a.price) {
                        var n = a.price;
                        r.updatePriceValueInRadio(n, o)
                    }
                    tcart__updateDelivery(),
                    r.changeDeliveryTypeListener(),
                    Array.prototype.forEach.call(e, (function(e) {
                        e.style.pointerEvents = ""
                    }
                    )),
                    tcart__showDeliveryPrice()
                };
                d || r.deliveryState.fullNames.street ? r.getDeliveryPrice({
                    projectId: a.projectId,
                    postalCode: p,
                    serviceId: o,
                    pickupPointId: d,
                    onDone: v,
                    onFail: function e() {
                        r.changeEndpoint(l, (function() {
                            r.getDeliveryPrice({
                                projectId: a.projectId,
                                postalCode: p,
                                serviceId: o,
                                pickupPointId: d,
                                onDone: v,
                                onFail: function e() {
                                    var t = "";
                                    t = "RU" === window.t_delivery__browserLang ? 'Невозможно получить почтовый индекс для доставки. Пожалуйста, перезагрузите страницу и попробуйте еще раз. Если ситуация не изменилась, обратитесь в поддержку <a href="mailto:team@tilda.cc?subject=Unable to get active service" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.' : 'Unable to get a postal code for delivery. Please <a href="javascript:window.location.reload();" style="color:#fff;text-decoration:underline;">reload the page</a> and try again. If the situation has not changed, please contact support <a href="mailto:team@tilda.cc?subject=Unable to get active service" style="color:#fff;text-decoration:underline;">team@tilda.cc</a>.',
                                    tcart__errorHandler.show("Request failed: " + t),
                                    window.tcart.emptyDeliveryServices = !0,
                                    tcart__updateDelivery()
                                }
                            })
                        }
                        ))
                    }
                }) : (tcart__updateDelivery(),
                r.changeDeliveryTypeListener(),
                tcart__showDeliveryPrice())
            }
            Array.prototype.forEach.call(e, (function(e) {
                e.style.pointerEvents = ""
            }
            ))
        };
        r.getServices(a.projectId, a.cityPostalCode, a.currencyCode, c, (function(e) {
            r.changeEndpoint(e, (function() {
                r.getServices(a.projectId, a.cityPostalCode, a.currencyCode, c)
            }
            ))
        }
        ))
    }
    ), 500)
}
function t_delivery__dict(e) {
    var t = [];
    t.address = {
        EN: "Address",
        RU: "Адрес",
        FR: "Adresse",
        DE: "Adresse",
        ES: "Dirección",
        PT: "Endereço",
        JA: "住所",
        ZH: "地址",
        UK: "Адреса",
        PL: "Adres",
        KK: "Мекен-жай",
        IT: "Indirizzo",
        LV: "Adrese"
    },
    t.city = {
        EN: "City",
        RU: "Город",
        FR: "Ville",
        DE: "Stadt",
        ES: "Ciudad",
        PT: "Cidade",
        JA: "市",
        ZH: "城市",
        UK: "Місто",
        PL: "Miasto",
        KK: "Қала",
        IT: "Città",
        LV: "Pilsēta"
    },
    t.street = {
        EN: "Street",
        RU: "Улица",
        FR: "Rue",
        DE: "Straße",
        ES: "Calle",
        PT: "Rua",
        JA: "通り",
        ZH: "街道",
        UK: "Вулиця",
        PL: "Ulica",
        KK: "Көше",
        IT: "Strada",
        LV: "Iela"
    },
    t.house = {
        EN: "House",
        RU: "Дом",
        FR: "Loger",
        DE: "Haus",
        ES: "Edificio №",
        PT: "Lar",
        JA: "家",
        ZH: "屋",
        UK: "Будинок",
        PL: "Budynek",
        KK: "Үй",
        IT: "Casa",
        LV: "Māja"
    },
    t.entrance = {
        EN: "Entrance",
        RU: "Подъезд",
        FR: "Entrée",
        DE: "Eingang",
        ES: "Entrada",
        PT: "Entrada",
        JA: "エントランス",
        ZH: "入口",
        UK: "Під’їзд",
        PL: "Wejście",
        KK: "Кіру",
        IT: "Ingresso",
        LV: "Ieeja"
    },
    t.floor = {
        EN: "Floor",
        RU: "Этаж",
        FR: "Étage",
        DE: "Fußboden",
        ES: "Planta",
        PT: "Andar",
        JA: "床",
        ZH: "地面",
        UK: "Поверх",
        PL: "Piętro",
        KK: "Еден",
        IT: "Pavimento",
        LV: "Stāvs"
    },
    t.apt = {
        EN: "Apt/office",
        RU: "Квартира/офис",
        FR: "Apt/bureau",
        DE: "Apt/Büro",
        ES: "Piso/oficina",
        PT: "Apt/escritório",
        JA: "アプト/オフィス",
        ZH: "公寓/办公室",
        UK: "Квартира/офіс",
        PL: "Mieszkanie/lokal",
        KK: "Пәтер/кеңсе",
        IT: "Abitazione/ufficio",
        LV: "Dzīvoklis/birojs"
    },
    t.phone = {
        EN: "Phone",
        RU: "Телефон",
        FR: "Téléphoner",
        DE: "Telefon",
        ES: "Teléfono",
        PT: "Telefone",
        JA: "電話",
        ZH: "电话",
        UK: "Телефон",
        PL: "Telefon",
        KK: "Телефон",
        IT: "Telefono",
        LV: "Tālrunis"
    },
    t.phones = {
        EN: "Phones",
        RU: "Телефоны",
        FR: "Téléphones",
        DE: "Telefone",
        ES: "Telefonos",
        PT: "Telefones",
        JA: "電話",
        ZH: "手机",
        UK: "Телефони",
        PL: "Telefony",
        KK: "Телефондар",
        IT: "Cellulari",
        LV: "Telefoni"
    },
    t.entranceCode = {
        EN: "Entrance code",
        RU: "Домофон",
        FR: "Code d'entrée",
        DE: "Zugangscode",
        ES: "Código de entrada",
        PT: "Código de entrada",
        JA: "エントランスコード",
        ZH: "入口代码",
        UK: "Домофон",
        PL: "Domofon",
        KK: "Түсу коды",
        IT: "Codice d'ingresso",
        LV: "Ieejas kods"
    },
    t.comment = {
        EN: "Comment",
        RU: "Комментарий",
        FR: "Commenter",
        DE: "Kommentar",
        ES: "Comentario",
        PT: "Comente",
        JA: "コメント",
        ZH: "评论",
        UK: "Коментар",
        PL: "Komentarz",
        KK: "Түсініктеме",
        IT: "Commento",
        LV: "Komentāri"
    },
    t.day = {
        EN: "day",
        RU: "дня",
        FR: "journée",
        DE: "tag",
        ES: "día",
        PT: "dia",
        JA: "日",
        ZH: "日",
        UK: "дні",
        PL: "dzień",
        KK: "күн",
        IT: "giorno",
        LV: "diena"
    },
    t.days = {
        EN: "days",
        RU: "дней",
        FR: "journées",
        DE: "Tage",
        ES: "dias",
        PT: "dias",
        JA: "日々",
        ZH: "天",
        UK: "днів",
        PL: "dzień",
        KK: "күн",
        IT: "giorni",
        LV: "dienas"
    },
    t.from = {
        EN: "from",
        RU: "от",
        FR: "de",
        DE: "von",
        ES: "de",
        PT: "de",
        JA: "から",
        ZH: "从",
        UK: "від",
        PL: "od",
        KK: "бастап",
        IT: "da",
        LV: "no"
    },
    t.deliveryNotPossible = {
        EN: "Unfortunately, delivery to your chosen city is not possible",
        RU: "К сожалению, в выбранный вами город доставка не осуществляется",
        FR: "Malheureusement, la livraison à votre ville choisie n'est pas possible",
        DE: "Leider ist eine Lieferung in der gewählten Stadt nicht möglich",
        ES: "Por desgracia, la entrega a su ciudad elegida no es posible",
        PT: "Infelizmente, a entrega à sua cidade escolhida não é possível",
        JA: "残念ながら、あなたの選ばれた都市への配信を行うことはできません",
        ZH: "不幸的是，送货到你所选择的城市是不可能的",
        UK: "На жаль, в обране місто доставка не здійснюється",
        PL: "Niestety nie dostarczamy w wybrane przez ciebie miejsce",
        KK: "Өкінішке орай, Сіздің таңдаған қалаға жеткізу мүмкін емес",
        IT: "Purtroppo, la consegna al vostro città scelta non è possibile",
        LV: "Diemžēl piegāde uz jūsu izvēlēto pilsētu netiek veikta"
    },
    t.delivery = {
        EN: "Delivery",
        RU: "Доставка",
        FR: "Livraison",
        DE: "Lieferung",
        ES: "Entrega",
        PT: "Entrega",
        JA: "配達",
        ZH: "交货",
        UK: "Доставка",
        PL: "Dostawa",
        KK: "Жеткізілім",
        IT: "Consegna",
        LV: "Piegāde"
    },
    t.pickup = {
        EN: "Pickup location",
        RU: "Пункт получения",
        FR: "Lieu de ramassage",
        DE: "Treffpunkt",
        ES: "Lugar de recogida",
        PT: "Local de retirada",
        JA: "ピックアップ場所",
        ZH: "接人的地方",
        UK: "Пункт отримання",
        PL: "Miejsce odbioru",
        KK: "Жеткізу орны",
        IT: "Posto di raccolta",
        LV: "Saņemšanas punkts"
    },
    t.selectPickup = {
        EN: "Select pickup location",
        RU: "Выберите пункт получения",
        FR: "Sélectionnez l'emplacement pick-up",
        DE: "Wählen Sie Abholort",
        ES: "Seleccionar ubicación de recogida",
        PT: "Escolha local de retirada",
        JA: "ピックアップ場所を選択",
        ZH: "选择的取货地点",
        UK: "Виберіть пункт отримання",
        PL: "Wybierz miejsce odbioru",
        KK: "Желімді орынды таңдаңыз",
        IT: "Seleziona ubicazione pickup",
        LV: "Izvēlieties pikaps atrašanās vietu"
    },
    t.selectAddress = {
        EN: "Please select an address from the options provided",
        RU: "Пожалуйста, выберите адрес из предложенных вариантов",
        FR: "S'il vous plaît sélectionner une adresse parmi les options proposées",
        DE: "Bitte wählen Sie eine Adresse aus den Optionen zur Verfügung gestellt",
        ES: "Por favor, seleccione una dirección de una de las opciones proporcionadas",
        PT: "Por favor seleccione um endereço entre as opções fornecidas",
        JA: "提供されるオプションからアドレスを選択してください",
        ZH: "请从所提供的选项的地址",
        UK: "Будь ласка, виберіть адресу із запропонованих варіантів",
        PL: "Wybierz adres wśród oferowanych opcji",
        KK: "Берілген параметрлерден мекенжайды таңдаңыз",
        IT: "Si prega di selezionare un indirizzo tra le opzioni previste",
        LV: "Lūdzu, izvēlieties adresi no piedāvātajām iespējām"
    },
    t.selectCity = {
        EN: "Please select an city from the options provided",
        RU: "Пожалуйста, выберите город из предложенных вариантов",
        FR: "S'il vous plaît choisir une ville parmi les options proposées",
        DE: "Bitte wählen Sie eine Stadt aus den Optionen zur Verfügung gestellt",
        ES: "Por favor, seleccione una ciudad de entre las opciones proporcionadas",
        PT: "Por favor, selecione uma cidade entre as opções fornecidas",
        JA: "提供されるオプションから都市を選択してください",
        ZH: "请从所提供的选项的城市",
        UK: "Будь ласка, виберіть місто із запропонованих варіантів",
        PL: "Wybierz miejsce wśród oferowanych opcji",
        KK: "Берілген параметрлерден бір қаланы таңдаңыз",
        IT: "Si prega di selezionare una città tra le opzioni previste",
        LV: "Lūdzu, izvēlieties pilsētu no piedāvātajām iespējām"
    },
    t.orderComment = {
        EN: "Order comment",
        RU: "Комментарий к заказу",
        FR: "Commentaire de commande",
        DE: "Bestellen Kommentar",
        ES: "Comentario de la orden",
        PT: "Comentário ordem",
        JA: "注文のコメント",
        ZH: "为了评论",
        UK: "Коментар до замовлення",
        PL: "Komentarz do zamówienia",
        KK: "Тапсырыс беру қатынасқа",
        IT: "Commento Order",
        LV: "Komentējiet pasūtījumu"
    },
    t.select = {
        EN: "Select",
        RU: "Выбрать",
        FR: "Sélectionner",
        DE: "Wählen",
        ES: "Seleccione",
        PT: "Selecionar",
        JA: "選択する",
        ZH: "选择",
        UK: "Вибрати",
        PL: "Wybierz",
        KK: "Таңдаңыз",
        IT: "Selezionare",
        LV: "Izvēlieties"
    },
    t.workingHours = {
        EN: "Working hours",
        RU: "Время работы",
        FR: "Heures d'ouverture",
        DE: "Arbeitszeit",
        ES: "Horas Laborales",
        PT: "Jornada de trabalho",
        JA: "勤務時間",
        ZH: "工作时间",
        UK: "Час роботи",
        PL: "Godziny robocze",
        KK: "Жұмыс сағаттары",
        IT: "Ore lavorative",
        LV: "Darba stundas"
    },
    t.unavailable = {
        EN: "Delivery service temporarily unavailable.",
        RU: "К сожалению, в данный момент сервис доставки недоступен.",
        FR: "Service de livraison temporairement indisponible.",
        DE: "Zustelldienst vorübergehend nicht verfügbar.",
        ES: "Servicio de entrega disponible temporalmente.",
        PT: "Serviço de entrega temporariamente indisponíveis.",
        JA: "配達サービスが一時的に利用できません。",
        ZH: "送货服务暂时不可用。",
        UK: "Служба доставки тимчасово не працює.",
        PL: "Niestety, w tym momencie dostawa nie jest możliwa.",
        KK: "Жеткізу қызметі уақытша қол жетімсіз.",
        IT: "Servizio di consegna temporaneamente non disponibile.",
        LV: "Diemžēl piegādes pakalpojums pašlaik nav pieejams."
    },
    t.loadingServices = {
        EN: "Loading delivery services",
        RU: "Получение сервисов доставки",
        FR: "Services de livraison de chargement",
        DE: "Laden Zustelldienste",
        ES: "Servicios Carga de entrega",
        PT: "Serviços de carga de entrega",
        JA: "ローディング配信サービス",
        ZH: "加载送货服务",
        UK: "Отримання сервісів доставки",
        PL: "Otrzymanie serwisów dostawy",
        KK: "Жеткізу қызметтері жүктелуде",
        IT: "Servizi di consegna Caricamento",
        LV: "Piegādes pakalpojumu saņemšana"
    },
    t.loadingPickup = {
        EN: "Loading a list of pickup locations",
        RU: "Получение списка пунктов выдачи заказов",
        FR: "Chargement d'une liste d'emplacements pick-up",
        DE: "Laden einer Liste von Standorten pickup",
        ES: "Carga de una lista de los lugares de recogida",
        PT: "Carregando uma lista de locais de coleta",
        JA: "ピックアップ場所のリストを読み込みます",
        ZH: "加载接客位置的列表",
        UK: "Отримання списку пунктів видачі замовлень",
        PL: "Otrzymanie listy miejsc wydania zamówień",
        KK: "Желімді орындардың тізімін жүктеу",
        IT: "Caricamento di un elenco di luoghi di ritiro",
        LV: "Saņemšanas punktu saraksta iegūšana"
    },
    t.noResult = {
        EN: "No results were found for your request",
        RU: "По вашему запросу ничего не найдено",
        FR: "Aucun résultat n'a été trouvé pour votre demande",
        DE: "Es wurden keine Ergebnisse für Ihre Anfrage gefunden",
        ES: "No se encontraron resultados para su solicitud",
        PT: "Não foram encontrados resultados para sua solicitação",
        JA: "該当する結果はあなたの要求のために見つかりませんでした",
        ZH: "没有找到您的要求",
        UK: "За вашим запитом нічого не знайдено",
        PL: "Brak wyników",
        KK: "Нәтижелері Сіздің сұранысыңыз бойынша табылған жоқ",
        IT: "Non sono stati trovati risultati per la tua richiesta",
        LV: "Jūsu meklēšanas vaicājumam netika atrasts neviens rezultāts"
    },
    t.change = {
        EN: "Change",
        RU: "Изменить",
        FR: "Changer",
        DE: "Veränderung",
        ES: "Cambio",
        PT: "Mudar",
        JA: "変化する",
        ZH: "改变",
        UK: "Змінити",
        PL: "Zmień",
        KK: "Өзгеріс",
        IT: "Modificare",
        LV: "Rediģēt"
    },
    t.fullName = {
        EN: "Full name",
        RU: "Получатель (ФИО полностью)",
        FR: "Nom et prénom",
        DE: "Vollständiger Name",
        ES: "Nombre completo",
        PT: "Nome completo",
        JA: "フルネーム",
        ZH: "全名",
        UK: "Одержувач (ПІБ повністю)",
        PL: "Pełne imię",
        KK: "Толық аты",
        IT: "Nome e cognome",
        LV: "Saņēmējs (pilns vārds)"
    },
    t.johnDoe = {
        EN: "John Doe",
        RU: "Иванов Иван Иванович",
        FR: "Jean Dupont",
        DE: "Max Mustermann",
        ES: "Fulano de Tal",
        PT: "Fulano de Tal",
        JA: "なになに",
        ZH: "张三",
        UK: "Іван Іванович Іваненко",
        PL: "Jan Kowalski",
        KK: "Алмаз Ахметов",
        IT: "Mario Rossi",
        LV: "John Doe"
    };
    var r = window.t_delivery__browserLang;
    return t[e] ? t[e][r] ? t[e][r] : t[e].EN : "Text not found #" + e
}
function t_delivery__declensionOfNumber(e) {
    return parseInt(e, 10) % 10 == 1 && 11 !== parseInt(e, 10) ? t_delivery__dict("day") : t_delivery__dict("days")
}
function t_delivery__showPrice(e) {
    if (void 0 === e || 0 == e || "" == e)
        e = "";
    else {
        var t;
        if (e = e.toString(),
        void 0 !== window.tcart.currency_dec && "00" == window.tcart.currency_dec)
            if (-1 === e.indexOf(".") && -1 === e.indexOf(","))
                e += ".00";
            else
                1 === e.substr(e.indexOf(".") + 1).length && (e += "0");
        e = e.replace(/\B(?=(\d{3})+(?!\d))/g, " "),
        void 0 !== window.tcart.currency_sep && "," == window.tcart.currency_sep && (e = e.replace(".", ",")),
        e = window.tcart.currency_txt_l + e + window.tcart.currency_txt_r
    }
    return e
}
function t_triggerEvent(e, t) {
    var r;
    document.createEvent ? (r = document.createEvent("HTMLEvents")).initEvent(t, !0, !1) : document.createEventObject && ((r = document.createEventObject()).eventType = t),
    r.eventName = t,
    e.dispatchEvent ? e.dispatchEvent(r) : e.fireEvent ? e.fireEvent("on" + r.eventType, r) : e[t] ? e[t]() : e["on" + t] && e["on" + t]()
}
function t_delivery__loadJSFile(e, t) {
    if (document.querySelector('script[src^="' + e + '"]'))
        t && t();
    else {
        var r = document.createElement("script");
        r.type = "text/javascript",
        r.src = e,
        t && (r.onload = t),
        r.onerror = function(e) {
            console.log("Upload script error: " + e)
        }
        ,
        document.head.appendChild(r)
    }
}

# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

server = @JmapConfig.api.location

window.JmapI18n =
  setLocale: (map, lang)->
    queryNames map, lang


queryNames = (map, lang)->
  key = Object.keys map.geomMap
  key.push( map.community.cid)
  $.ajax
    async: false
    type: 'POST'
    url: "#{server}query"
    data:
      id: key
      name: ['name','icname','shortname']
      lang: lang
    success: (data)->
      applied = {}
      for text in data?.response?.info?.texts

        community = map.community
        if community.cid != undefined and String(community.cid) == text.id and text.attrs.name[0] != undefined
          cname = text.attrs.name[0]
          community.nm = "" 
          continue

        geom = map.geomMap[gid = text.id]

        if text.attrs.name != undefined or text.attrs.shortname != undefined
          if text.attrs.shortname != undefined
            name = text.attrs.shortname[0]
          else
            name = text.attrs.name[0]
        else if  text.attrs.icname != undefined
          name = text.attrs.icname[0]

        geom.g.nm = name
        geom.g.lr = name if geom.g.lt == 1
        geom.g.lr = name if geom.g.lt == undefined

      applied[gid] = true
#      translateWords map, lang, applied

translateWords = (map, lang, applied)->
  words = {}

  for gid, geom of map.geomMap
    if name = geom.g?.nm
      words[name] = undefined unless applied[gid]
  words = Object.keys words

  $.ajax
    type: 'POST'
    url: "#{server}translate"
    data:
      type: 'common'
      word: words
      from: 'ja'
      to: lang
    success: (data)->
      dictionary = {}
      for i, to of data?.response?.info?.word
        dictionary[words[i]] = to

      for gid, geom of map.geomMap
        if name = geom.g?.nm
          geom.g?.nm = dictionary[name] if dictionary[name]

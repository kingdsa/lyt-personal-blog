
const raw = '/static'

const faceList = [`${raw}/emoji/smile.webp`, `${raw}/emoji/tv/tv.webp`]

const emojiList = [
  {
    '[口罩]': `${raw}/emoji/kouzhao.webp`,
    '[狗头]': `${raw}/emoji/goutou.webp`,
    '[微笑]': `${raw}/emoji/smile.webp`,
    '[OK]': `${raw}/emoji/ok.webp`,
    '[星星眼]': `${raw}/emoji/star.webp`,
    '[辣眼睛]': `${raw}/emoji/layanjing.webp`,
    '[吃瓜]': `${raw}/emoji/chigua.webp`,
    '[滑稽]': `${raw}/emoji/huaji.webp`,
    '[呲牙]': `${raw}/emoji/teeth.webp`,
    '[打call]': `${raw}/emoji/dacall.webp`,
    '[喝酒]': `${raw}/emoji/hejiu.webp`,
    '[乖]': `${raw}/emoji/guai.webp`,
    '[吐舌]': `${raw}/emoji/tushe.webp`,
    '[汗]': `${raw}/emoji/han.webp`,
    '[大哭2]': `${raw}/emoji/daku.webp`,
    '[超赞]': `${raw}/emoji/chaozan.webp`,
    '[超开心]': `${raw}/emoji/chaokaixin.webp`,
    '[委屈]': `${raw}/emoji/weiqu.webp`,
    '[困狗]': `${raw}/emoji/kungou.webp`,
    '[藏狐]': `${raw}/emoji/zanghu.webp`,
    '[脸红]': `${raw}/emoji/lianhong.webp`,
    '[脱单doge]': `${raw}/emoji/doge.webp`,
    '[给心心]': `${raw}/emoji/heart.webp`,
    '[笑]': `${raw}/emoji/dx.webp`,
    '[哦呼]': `${raw}/emoji/oh.webp`,
    '[嫌弃]': `${raw}/emoji/xq.webp`,
    '[喜欢]': `${raw}/emoji/like.webp`,
    '[酸了]': `${raw}/emoji/sl.webp`,
    '[大哭]': `${raw}/emoji/dq.webp`,
    '[害羞]': `${raw}/emoji/hx.webp`,
    '[无语]': `${raw}/emoji/wy.webp`,
    '[疑惑]': `${raw}/emoji/yh.webp`,
    '[调皮]': `${raw}/emoji/tiaopi.webp`,
    '[笑哭]': `${raw}/emoji/xiaoku.webp`,
    '[奸笑]': `${raw}/emoji/jianxiao.webp`,
    '[偷笑]': `${raw}/emoji/touxiao.webp`,
    '[大笑]': `${raw}/emoji/daxiao.webp`,
    '[阴险]': `${raw}/emoji/yinxian.webp`,
    '[捂脸]': `${raw}/emoji/wulian.webp`,
    '[惊喜]': `${raw}/emoji/jingxi.webp`,
    '[惊讶]': `${raw}/emoji/jingya.webp`,
    '[捂脸哭]': `${raw}/emoji/wulianku.webp`,
    '[妙啊]': `${raw}/emoji/miaoa.webp`,
    '[鼓掌]': `${raw}/emoji/guzhang.webp`,
    '[尴尬]': `${raw}/emoji/ganga.webp`,
    '[冷]': `${raw}/emoji/cold.webp`,
    '[灵魂出窍]': `${raw}/emoji/linghunchuqiao.webp`,
    '[傲娇]': `${raw}/emoji/aojiao.webp`,
    '[疼]': `${raw}/emoji/teng.webp`,
    '[吓]': `${raw}/emoji/xia.webp`,
    '[生病]': `${raw}/emoji/shengbing.webp`,
    '[吐]': `${raw}/emoji/tu.webp`,
    '[嘘声]': `${raw}/emoji/xusheng.webp`,
    '[捂眼]': `${raw}/emoji/wuyan.webp`,
    '[思考]': `${raw}/emoji/sikao.webp`,
    '[再见]': `${raw}/emoji/zaijian.webp`,
    '[翻白眼]': `${raw}/emoji/fanbaiyan.webp`,
    '[哈欠]': `${raw}/emoji/haqian.webp`,
    '[奋斗]': `${raw}/emoji/fengdou.webp`,
    '[墨镜]': `${raw}/emoji/mojing.webp`,
    '[撇嘴]': `${raw}/emoji/piezui.webp`,
    '[难过]': `${raw}/emoji/nanguo.webp`,
    '[抓狂]': `${raw}/emoji/zhuakuang.webp`,
    '[生气]': `${raw}/emoji/shengqi.webp`,
    '[爱心]': `${raw}/emoji/aixin.webp`,
    '[胜利]': `${raw}/emoji/shengli.webp`,
    '[抱拳]': `${raw}/emoji/baoquan.webp`,
    '[保佑]': `${raw}/emoji/baoyou.webp`,
    '[支持]': `${raw}/emoji/zhichi.webp`
  },
  {
    '[tv_doge]': `${raw}/emoji/tv/doge.webp`,
    '[tv_坏笑]': `${raw}/emoji/tv/huaixiao.webp`,
    '[tv_难过]': `${raw}/emoji/tv/nanguo.webp`,
    '[tv_生气]': `${raw}/emoji/tv/shengqi.webp`,
    '[tv_委屈]': `${raw}/emoji/tv/weiqu.webp`,
    '[tv_斜眼笑]': `${raw}/emoji/tv/xieyanxiao.webp`,
    '[tv_呆]': `${raw}/emoji/tv/dai.webp`,
    '[tv_发怒]': `${raw}/emoji/tv/fanu.webp`,
    '[tv_惊吓]': `${raw}/emoji/tv/jingxia.webp`,
    '[tv_呕吐]': `${raw}/emoji/tv/outu.webp`,
    '[tv_思考]': `${raw}/emoji/tv/sikao.webp`,
    '[tv_微笑]': `${raw}/emoji/tv/weixiao.webp`,
    '[tv_疑问]': `${raw}/emoji/tv/yiwen.webp`,
    '[tv_大哭]': `${raw}/emoji/tv/daku.webp`,
    '[tv_鼓掌]': `${raw}/emoji/tv/guzhang.webp`,
    '[tv_抠鼻]': `${raw}/emoji/tv/koubi.webp`,
    '[tv_亲亲]': `${raw}/emoji/tv/qinqin.webp`,
    '[tv_调皮]': `${raw}/emoji/tv/tiaopi.webp`,
    '[tv_笑哭]': `${raw}/emoji/tv/xiaoku.webp`,
    '[tv_晕]': `${raw}/emoji/tv/yun.webp`,
    '[tv_点赞]': `${raw}/emoji/tv/dianzan.webp`,
    '[tv_害羞]': `${raw}/emoji/tv/haixiu.webp`,
    '[tv_睡着]': `${raw}/emoji/tv/shuizhe.webp`,
    '[tv_色]': `${raw}/emoji/tv/se.webp`,
    '[tv_吐血]': `${raw}/emoji/tv/tuxue.webp`,
    '[tv_无奈]': `${raw}/emoji/tv/wunai.webp`,
    '[tv_再见]': `${raw}/emoji/tv/zaijian.webp`,
    '[tv_流汗]': `${raw}/emoji/tv/liuhan.webp`,
    '[tv_偷笑]': `${raw}/emoji/tv/touxiao.webp`,
    '[tv_抓狂]': `${raw}/emoji/tv/zhuakuang.webp`,
    '[tv_黑人问号]': `${raw}/emoji/tv/wenhao.webp`,
    '[tv_困]': `${raw}/emoji/tv/kun.webp`,
    '[tv_打脸]': `${raw}/emoji/tv/dalian.webp`,
    '[tv_闭嘴]': `${raw}/emoji/tv/bizui.webp`,
    '[tv_鄙视]': `${raw}/emoji/tv/bishi.webp`,
    '[tv_腼腆]': `${raw}/emoji/tv/miantian.webp`,
    '[tv_馋]': `${raw}/emoji/tv/chan.webp`,
    '[tv_可爱]': `${raw}/emoji/tv/keai.webp`,
    '[tv_发财]': `${raw}/emoji/tv/facai.webp`,
    '[tv_生病]': `${raw}/emoji/tv/shengbing.webp`,
    '[tv_流鼻血]': `${raw}/emoji/tv/liubixue.webp`,
    '[tv_尴尬]': `${raw}/emoji/tv/ganga.webp`,
    '[tv_大佬]': `${raw}/emoji/tv/dalao.webp`,
    '[tv_流泪]': `${raw}/emoji/tv/liulei.webp`,
    '[tv_冷漠]': `${raw}/emoji/tv/lenmo.webp`,
    '[tv_皱眉]': `${raw}/emoji/tv/zhoumei.webp`,
    '[tv_鬼脸]': `${raw}/emoji/tv/guilian.webp`,
    '[tv_调侃]': `${raw}/emoji/tv/tiaokan.webp`,
    '[tv_目瞪口呆]': `${raw}/emoji/tv/mudengkoudai.webp`
  }
]

//把emojiList数组中的每一个对象，放到emojiMap中方便取用
function allEmoji() {
  let emojiMap = {}
  emojiList.map(emojis => (emojiMap = { ...emojiMap, ...emojis }))
  return emojiMap
}

export default {
  faceList,
  emojiList,
  allEmoji: allEmoji()
}

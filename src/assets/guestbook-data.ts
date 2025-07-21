// 留言板数据类型定义
export interface MessageData {
  id: string
  parentId: string | null
  uid: string
  address?: string
  content: string
  likes: number
  contentImg?: string
  createTime: string
  user: {
    username: string
    avatar: string
    level?: number
    homeLink?: string
  }
  replies?: MessageData[]
}

// 留言板模拟数据
const guestbookMessages: MessageData[] = [
  {
    id: 'msg-001',
    parentId: null,
    uid: 'user-001',
    address: '来自北京',
    content: '这是我的第一条留言！感谢站长提供这么好的平台，希望能认识更多朋友 [微笑]',
    likes: 15,
    contentImg: '',
    createTime: '1小时前',
    user: {
      username: '张三',
      avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG',
      level: 3,
      homeLink: '/user/001'
    },
    replies: [
      {
        id: 'reply-001-1',
        parentId: 'msg-001',
        uid: 'user-admin',
        address: '来自北京',
        content: '欢迎新朋友！希望你在这里玩得开心 [爱心]',
        likes: 8,
        createTime: '50分钟前',
        user: {
          username: '站长',
          avatar: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
          level: 6,
          homeLink: '/admin'
        }
      },
      {
        id: 'reply-001-2',
        parentId: 'msg-001',
        uid: 'user-002',
        address: '来自上海',
        content: '同为新人，一起加油！[握手]',
        likes: 5,
        createTime: '30分钟前',
        user: {
          username: '李四',
          avatar: 'https://static.juzicon.com/avatars/avatar-190919180152-2VDE.jpg',
          level: 2,
          homeLink: '/user/002'
        }
      }
    ]
  },
  {
    id: 'msg-002',
    parentId: null,
    uid: 'user-003',
    address: '来自深圳',
    content: '刚看完最新的博文，写得真不错！技术分享很有深度，学到了很多 [超赞]\n\n特别是关于Vue3的那部分，解决了我工作中的一个难题',
    likes: 23,
    contentImg: '/static/img/code-example.png',
    createTime: '3小时前',
    user: {
      username: '前端小白',
      avatar: 'https://static.juzicon.com/user/avatar-bf22291e-ea5c-4280-850d-88bc288fcf5d-220408002256-ZBQQ.jpeg',
      level: 4,
      homeLink: '/user/003'
    },
    replies: [
      {
        id: 'reply-002-1',
        parentId: 'msg-002',
        uid: 'user-admin',
        address: '来自北京',
        content: '谢谢支持！能帮到大家就是我写博客的最大动力',
        likes: 12,
        createTime: '2小时前',
        user: {
          username: '站长',
          avatar: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
          level: 6,
          homeLink: '/admin'
        }
      }
    ]
  },
  {
    id: 'msg-003',
    parentId: null,
    uid: 'user-004',
    address: '来自杭州',
    content: '生活不只是代码，还有诗和远方 [思考]\n\n今天在西湖边走了一圈，突然觉得写代码和赏风景都是一种享受。希望所有程序员都能保持热爱！',
    likes: 31,
    contentImg: 'https://pic.rmb.bdstatic.com/bjh/240305/8c0f8a5c91f4b8e8b4e8f4e4b3e2f1e3.jpeg, https://pic.rmb.bdstatic.com/bjh/240305/west-lake-sunset.jpeg',
    createTime: '1天前',
    user: {
      username: '诗意程序员',
      avatar: 'https://static.juzicon.com/user/avatar-8b6206c1-b28f-4636-8952-d8d9edec975d-191001105631-MDTM.jpg',
      level: 5,
      homeLink: '/user/004'
    },
    replies: [
      {
        id: 'reply-003-1',
        parentId: 'msg-003',
        uid: 'user-005',
        address: '来自成都',
        content: '说得太好了！工作之余确实要多出去走走',
        likes: 6,
        createTime: '20小时前',
        user: {
          username: '成都小哥',
          avatar: 'https://static.juzicon.com/avatars/avatar-20220310090547-fxvx.jpeg',
          level: 3,
          homeLink: '/user/005'
        }
      },
      {
        id: 'reply-003-2',
        parentId: 'msg-003',
        uid: 'user-006',
        address: '来自广州',
        content: '西湖的照片好美！下次去杭州一定要去看看',
        likes: 4,
        createTime: '15小时前',
        user: {
          username: '摄影爱好者',
          avatar: 'https://static.juzicon.com/user/avatar-3cb86a0c-08e7-4305-9ac6-34e0cf4937cc-180320123405-BCV6.jpg',
          level: 4,
          homeLink: '/user/006'
        }
      },
      {
        id: 'reply-003-3',
        parentId: 'msg-003',
        uid: 'user-007',
        address: '来自武汉',
        content: '程序员也要有生活情调！赞同 [点赞]',
        likes: 7,
        createTime: '12小时前',
        user: {
          username: '武汉热干面',
          avatar: 'https://static.juzicon.com/avatars/avatar-190919180320-NAQJ.jpg',
          level: 2,
          homeLink: '/user/007'
        }
      },
      {
        id: 'reply-003-4',
        parentId: 'msg-003',
        uid: 'user-008',
        address: '来自重庆',
        content: '看到这种正能量的留言就很开心，大家一起加油！',
        likes: 9,
        createTime: '8小时前',
        user: {
          username: '重庆小面',
          avatar: 'https://static.juzicon.com/user/avatar-0d70406e-5d4a-4107-a689-652ffd063f99-200425180341-1QK6.jpg',
          level: 3,
          homeLink: '/user/008'
        }
      }
    ]
  },
  {
    id: 'msg-004',
    parentId: null,
    uid: 'user-009',
    address: '来自苏州',
    content: '求问站长，后面会不会出一些关于Node.js的教程？最近在学后端，感觉有些地方还是不太理解 [疑惑]',
    likes: 18,
    contentImg: '',
    createTime: '2天前',
    user: {
      username: 'Node新手',
      avatar: 'https://static.juzicon.com/user/avatar-f103e42d-a5c9-4837-84e3-d10fad0bcb36-210108053135-E90E.jpg',
      level: 2,
      homeLink: '/user/009'
    },
    replies: [
      {
        id: 'reply-004-1',
        parentId: 'msg-004',
        uid: 'user-admin',
        address: '来自北京',
        content: 'Node.js教程已经在规划中了！预计下个月会发布第一篇，敬请期待 [ok]',
        likes: 20,
        createTime: '1天前',
        user: {
          username: '站长',
          avatar: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
          level: 6,
          homeLink: '/admin'
        }
      },
      {
        id: 'reply-004-2',
        parentId: 'msg-004',
        uid: 'user-010',
        address: '来自西安',
        content: '同求Node教程！前端转全栈的路上 [加油]',
        likes: 11,
        createTime: '1天前',
        user: {
          username: '全栈路上',
          avatar: 'https://static.juzicon.com/avatars/avatar-190919181051-M3HK.jpg',
          level: 3,
          homeLink: '/user/010'
        }
      }
    ]
  },
  {
    id: 'msg-005',
    parentId: null,
    uid: 'user-011',
    address: '来自厦门',
    content: '网站的设计真的很棒！简洁而不失美感，用户体验也很好 [爱心]\n\n能分享一下用了哪些技术栈吗？想学习一下',
    likes: 27,
    contentImg: '',
    createTime: '3天前',
    user: {
      username: 'UI设计师',
      avatar: 'https://static.juzicon.com/user/avatar-f81b3655-03fd-485c-811b-4b5ceaca52b6-210817180051-YTO4.jpg',
      level: 4,
      homeLink: '/user/011'
    },
    replies: [
      {
        id: 'reply-005-1',
        parentId: 'msg-005',
        uid: 'user-admin',
        address: '来自北京',
        content: '谢谢夸奖！主要用的Vue3 + NaiveUI + TypeScript，后面会写一篇技术分享',
        likes: 15,
        createTime: '2天前',
        user: {
          username: '站长',
          avatar: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
          level: 6,
          homeLink: '/admin'
        }
      }
    ]
  }
]

// 工具函数：生成随机ID
export const generateId = (): string => {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

// 工具函数：格式化时间
export const formatTime = (date: string | Date): string => {
  const now = new Date()
  const messageTime = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return '刚刚'
  if (diffInMinutes < 60) return `${diffInMinutes}分钟前`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}小时前`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}天前`
  
  return messageTime.toLocaleDateString()
}

// 工具函数：获取用户地址（模拟）
export const getCurrentUserAddress = (): string => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '苏州']
  const randomCity = cities[Math.floor(Math.random() * cities.length)]
  return `来自${randomCity}`
}

// 工具函数：创建新留言对象
export const createNewMessage = (content: string, images: string[] = [], user: User): MessageData => {
  return {
    id: generateId(),
    parentId: null,
    uid: user.id || 'anonymous',
    address: getCurrentUserAddress(),
    content: content,
    likes: 0,
    contentImg: images.length > 0 ? images.join(', ') : '',
    createTime: '刚刚',
    user: {
      username: user.username || '匿名用户',
      avatar: user.avatar!,
      homeLink: `/user/${user.id}`
    },
    replies: []
  }
}

// 工具函数：创建新回复对象
export const createNewReply = (content: string, parentId: string, user: User, replyToUser?: string): MessageData => {
  const replyContent = replyToUser 
    ? `回复 <span style="color: var(--n-color-primary);">@${replyToUser}:</span> ${content}`
    : content
    
  return {
    id: generateId(),
    parentId: parentId,
    uid: user.id || 'anonymous',
    address: getCurrentUserAddress(),
    content: replyContent,
    likes: 0,
    createTime: '刚刚',
    user: {
      username: user.username || '匿名用户',
      avatar: user.avatar!,
      homeLink: `/user/${user.id}`
    }
  }
}

export { guestbookMessages } 
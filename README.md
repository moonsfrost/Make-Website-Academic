# Make-Website-Academic

这是一个让你的B站变得学术化的Chrome拓展（当然也可以用于Edge，~~其实主要就是在Edge的环境下测试的~~）

### 这个拓展适合的用户

- 在B站上查找资料时容易被无关内容吸引导致效率低下的用户

- 想要看一会视频放松但是不想陷入信息流里的用户

### 如何使用

下载源代码，直接加载解压缩的拓展即可（自行上网搜索教程）

单击拓展按钮，在弹出界面内切换学术模式和有限娱乐模式（绿色代表现在为学术模式，红色代表为有限娱乐模式或者摆烂模式）

设置页面可以调整有限娱乐时间

### 已经实现的功能

- 学术模式
  - 屏蔽了绝大多数与学习无关的页面
  - 对首页进行了高度精简化
  - 访问某些 tag（如游戏、动漫）的视频时需要进行确认
  - 启用了“随时记”功能
- 随时记
  - 可以在查找资料时方便地整理网页内容
  - 编辑内容时可以在开头添加`[*]`为内容添加指向本网页的超链接/`[url]`添加指向该url的超链接
  - 将表内内容导出到剪贴板
- 有限娱乐模式
  - 相比学术模式开放了一些功能
  - 允许访问动态页面
  - 屏蔽了视频的推荐
  - 在一定的时间（默认为30分钟） 后自动切换为学术模式
- 摆烂模式（需在设置内开启）
  - 不对B站做任何更改
  - 在本日内维持摆烂模式，次日自动调整回学术模式

### 期望实现的特性
- 自定义屏蔽的视频 tag 类型
- 对 UI 进行优化
- 多窗口条件下随时记的同步问题

### 大饼时间
- 对其它娱乐学习性质兼备的网站（如知乎）也进行类似的处理

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const deadlineInput = document.getElementById('deadlineInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const finalizeBtn = document.getElementById('finalizeBtn');
    const taskList = document.getElementById('taskList');
    const comboContainer = document.getElementById('comboContainer');
    const finalOverlay = document.getElementById('finalOverlay');
    const screenGlow = document.getElementById('screenGlow');
    const taskStats = document.getElementById('taskStats');

    let tasks = JSON.parse(localStorage.getItem('mind_tasks_v7')) || [];
    let comboCount = 0;
    let lastCheckTime = 0;

    const commentData = {
        categories: {
            "生存": [
                { active: "またこの世界に留まるための手続きをするのかい？", completed: "完了だ。君という実体が、また数分だけこの次元に固定された。" },
                { active: "肉体という名の不自由な檻を、今日もメンテナンスするんだね。", completed: "調整完了。その檻は、まだ君を外へ逃がす気はないらしい。" },
                { active: "欠乏を埋める作業。君の人生は、結局その繰り返しで終わる。", completed: "一時的な充足。どうせすぐに、また次の「空腹」がやってくるよ。" },
                { active: "滅びへと向かう流れに、ささやかな逆らいを試みるのか。", completed: "抵抗成功。死神の足音が、ほんの一歩だけ遠のいた音がした。" },
                { active: "当たり前の循環。それをタスクと呼ぶ君の厚かましさが好きだよ。", completed: "循環維持。世界は君がいてもいなくても回るが、君は回ることを選んだ。" },
                { active: "意味などない。ただ「在る」ことを継続するために、君は動く。", completed: "存続。無意味な空白を、また一つ「生存」という記号で塗りつぶしたね。" },
                { active: "細胞の叫びに、君という意識が従わされているだけじゃないかな？", completed: "従順だね。本能という名の見えない鎖に、また一つ勲章が増えた。" },
                { active: "効率を求める生存。それは加速しながら死に向かうのと同義だよ。", completed: "加速完了。無事に時間を削り取って、君はどこへ辿り着きたいんだい？" },
                { active: "物理法則への微かな抵抗。君の存在そのものが、宇宙のバグのようだ。", completed: "バグ修正失敗。君はまだ、この世界から消去されずに済んだようだ。" },
                { active: "維持すること。それは現状を維持するために、全力を出すという矛盾。", completed: "現状維持。必死に走って、ようやく同じ場所に留まれたというわけだ。" },
                { active: "借り物の命。その返済期限を延ばすために、君は今日も奔走する。", completed: "返済完了。今日の利息分は払えたようだね。明日もまた取り立てが来るよ。" },
                { active: "外側を整える。内側の空虚さが漏れ出さないように、必死だね。", completed: "補修完了。見かけ上の「人間らしさ」を保つことに、また成功した。" },
                { active: "摩擦。君が動くたび、君の命は摩耗していく。自覚はあるかい？", completed: "摩耗完了。削り取られた時間の破片が、足元に虚しく転がっている。" },
                { active: "呼吸を止める勇気がないから、君はそのタスクを行うんだろう？", completed: "妥協。生への未練を、また一つ形にしてしまったね。" },
                { active: "静止することを恐れているのかい？動いていれば、生きてると錯覚できる。", completed: "幻覚の継続。動いた分だけ、自分が価値ある存在だと思い込めたかな？" },
                { active: "有機物の集積。君を構成する原子たちが、解散したがっているよ。", completed: "結合維持。バラバラになる恐怖に打ち勝ち、また一時の形を保った。" },
                { active: "それは「必要」なことなのかい？それとも「逃避」の一部なのかな？", completed: "判定不能。だが、君の時間は確実に奪われた。それだけが真実だ。" },
                { active: "重力という名の恋人に、君は今日も強く抱きしめられているね。", completed: "接地。地に足をつけたふりをして、魂はどこへ逃げているんだい？" },
                { active: "意識を維持するコスト。君はそれに見合うだけの何かを、今日産み出すの？", completed: "コスト支払い完了。見返りのない投資こそが、生存の本質なのかもしれない。" },
                { active: "最後の審判を待つ間の、暇つぶしにしては少し地味すぎるかな。", completed: "延命。審判の日はまた一日遠のいた。喜ぶべきか、悲しむべきか。" }
            ],
            "責務": [
                { active: "社会という巨大な歯車が、君の摩耗を待ち侘びているよ。", completed: "潤滑完了。君の犠牲によって、この虚無な機構は今日も回り続ける。" },
                { active: "他者の期待という名の透明な鎖。心地よさすら感じ始めているのかい？", completed: "繋留確認。鎖の強度を確かめて安心するなんて、君も随分と飼い慣らされたね。" },
                { active: "君の代わりなどいくらでもいるという事実から、目を逸らすための儀式だ。", completed: "埋め合わせ完了。君という「部品」の賞味期限が、数時間だけ更新されたよ。" },
                { active: "正しさの奴隷。君の純粋さは、どこで数字に買い叩かれたんだい？", completed: "売買成立。魂のひとかけらを差し出して、君は何を買い取ったつもりかな。" },
                { active: "義務感という麻薬。それを打っている間だけは、自分が価値ある存在だと思える。", completed: "薬効持続。かりそめの万能感に浸りながら、また次の「投与」を待つがいい。" },
                { active: "それは君の意志か、それとも誰かに埋め込まれたプログラムか。", completed: "実行完了。優秀な端末だね。君の個性が消えていく音が聞こえるよ。" },
                { active: "誰かが決めた「重要度」に、君の貴重な寿命を捧げる価値はあるのかな？", completed: "奉納。君の時間が、誰かの利益という名の煙に変わっていった。" },
                { active: "未来のために今を殺す。そうして辿り着くる未来も、また何かの準備で終わるんだ。", completed: "葬儀完了。今日という「今」を、義務の祭壇に捧げた君を弔おう。" },
                { active: "序列を競う競争原理。君は今、何番目の羊として登録されているんだい？", completed: "格付け更新。群れの中に留まれた安堵感で、尻尾を振っているのが見えるよ。" },
                { active: "責任。その言葉を背負うことで、思考を停止させようとしていないか。", completed: "思考停止。重荷を下ろした瞬間の解放感すら、計算された報酬に過ぎない。" },
                { active: "規律を守る君は美しいよ。檻の中で整列する囚人のようにね。", completed: "点呼完了。模範囚としての評価が上がった。ご褒美に明日の義務を授けよう。" },
                { active: "貢献という名の免罪符。君は何の罪を許してほしくて、そんなに必死なの？", completed: "贖罪完了。だが残念ながら、君の存在そのものが背負う原罪は消えやしない。" },
                { active: "世界の調和を保つための小さな犠牲。君がその一端を担うという喜劇。", completed: "幕引き。一人の端役が役割を終えた。観客席には、誰もいないけれど。" },
                { active: "必要とされる喜び。それは、使い捨てられる恐怖の裏返しではないかい。", completed: "消耗完了。まだ「使える」と判断されたようだ。さあ、次の戦場へ。" },
                { active: "組織の論理に、君の繊細な美意識を無理やり詰め込む作業だね。", completed: "圧縮完了。はみ出した個性は、どこへ捨ててきたんだい？" },
                { active: "評価を気にするその瞳。君の神様は、一体どこのデスクに座っているの？", completed: "査定終了。神の微笑みか、あるいは無関心か。どちらにせよ君は止まれない。" },
                { active: "効率という名の刃で、君の人生を細切れにしていくんだね。", completed: "切断完了。細かくなった時間は、もう二度と元の輝きを取り戻さない。" },
                { active: "「やらねばならない」という呪文。君の口癖は、いつから祈りに変わったんだい。", completed: "祈祷終了。呪いは解けず、ただ次の章へと引き継がれるだけだ。" },
                { active: "君がこなすその作業、100年後の誰が覚えていると思う？", completed: "霧散。君の努力は、歴史の地層に埋もれることすらない微粒子となった。" },
                { active: "予定調和の海で溺れている君へ。救命ボートは、最初から穴が開いているよ。", completed: "漂流継続。沈まないための努力を、人は「立派な仕事」と呼ぶらしい。" },
                { active: "誰かの命令を自分の願いだと勘違いする。それが大人の処世術かな。", completed: "同化完了。君自身の声が聞こえなくなるまで、あとどれくらいの義務が必要？" },
                { active: "生産性という名の怪物に、君の好奇心を餌として与えるんだ。", completed: "捕食完了。満腹になった怪物は、明日もっと大きな生贄を要求するだろう。" },
                { active: "達成感という報酬。それは、労働という苦痛を忘れさせるための甘い毒。", completed: "中毒症状。次なる快楽を求めて、君はまた自ら首輪を締め直すんだね。" },
                { active: "君が積み上げているのは、天国への階段か、それとも自分を閉じ込める壁か。", completed: "建築継続。高く積み上がるほど、君の姿は外からは見えなくなる。" },
                { active: "平均への回帰。突出することを恐れ、君は今日も「普通」を演じる。", completed: "調整完了。おめでとう、君は今日も目立たず、静かに埋没することに成功した。" },
                { active: "正解のある問いを解く。それは、思考のフリをしたただの検索作業だ。", completed: "出力完了。君というハードウェアが、また一つ既知のデータを処理した。" },
                { active: "社会的地位という虚飾。それを支えるための土台に、君の肉体を敷き詰める。", completed: "補強完了。君が削れた分だけ、その虚飾はより強固に輝きを増す。" },
                { active: "文明の維持コスト。君という個人の情熱を、その燃料として燃やすんだ。", completed: "燃焼完了。残った灰は、風に吹かれて消えるだけの運命にある。" },
                { active: "完璧主義という病。君を追い詰めているのは、鏡の中にいる君自身だよ。", completed: "妥協。完璧に届かない絶望を、忙しさという毛布で隠したね。" },
                { active: "最後にはすべて無に帰すのに。その「責務」に、どんな永遠を夢見ているの？", completed: "完遂。一時の安らぎ。だが、君の背後にはもう次の影が忍び寄っている。" }
            ],
            "関係": [
                { active: "他者という鏡の中に、君は一体どんな自分を映し出そうとしているんだい？", completed: "照合完了。鏡に映ったのは、君の望んだ姿か、それともありのままの虚像か。" },
                { active: "繋がりを求める心。それは、個体として完結できない不完全さの証だろうか。", completed: "共鳴。欠けたパズルを埋めるように、君はまた誰かの時間と重なり合った。" },
                { active: "誰かに声をかける。それは、静寂な宇宙に小さな石を投じるような行為だ。", completed: "波紋。君が投げた石は、誰かの心の深層まで届いただろうか。" },
                { active: "血縁、あるいは縁。見えない糸に引かれ、君は今日も誰かの重力を感じている。", completed: "結節。糸を固く結び直すことで、君の居場所はより確かなものになった。" },
                { active: "言葉という不確かな舟で、君は他者という対岸へ渡ろうとしているんだね。", completed: "接岸。届いた言葉と、届かなかった沈黙。その両方が君たちの関係を形作る。" },
                { active: "理解し合えるという幻想。その美しい誤解を維持するために、君は何を語る？", completed: "共有。重なり合った一瞬の領域を、人は「絆」と呼んで大切に扱う。" },
                { active: "誰かのために動くとき、君の自我は少しだけ境界線を広げている。", completed: "拡張。君という個を越えて、想いが他者の領域へと浸透していった。" },
                { active: "待っている誰かがいる。その事実が、君の存在に重みを与えているんだね。", completed: "呼応。必要とされることで、君という存在の輪廓が鮮明に縁取られた。" },
                { active: "孤独を癒すための交流か、それとも孤独を分かち合うための対話か。", completed: "融合。溶け合うことはできなくても、隣に座る温度だけは共有できたようだ。" },
                { active: "社会という網の目。君はその結び目の一つとして、何を支えようとしているの？", completed: "保持。網は少し強固になった。君がそこに留まることで、救われる誰かがいる。" },
                { active: "愛情、あるいは義務。その境界線は、いつだって霧に包まれている。", completed: "浸透。理屈を超えた衝動が、君と誰かの距離を決定的に縮めたようだ。" },
                { active: "贈り物を選ぶように、君は他者への振る舞いを選び取っているんだね。", completed: "贈呈。君が差し出したのは、モノではなく「費やした時間」という名の誠実だ。" },
                { active: "許し、あるいは歩み寄り。それは自分の一部を削り、相手の形を受け入れること。", completed: "調和。尖っていた角が取れ、二つの魂が少しだけ滑らかに触れ合った。" },
                { active: "遠くの誰かを想う。物理的な距離を、想像力という翼が飛び越えていく。", completed: "到達。距離はもはや意味をなさない。想いの速度は光すら追い越すのだから。" },
                { active: "家族という名の物語。君はその一頁に、どんな一文を書き加えようとしている？", completed: "記帳。物語は続く。君が刻んだ日常が、いつか誰かの記憶の糧になる。" },
                { active: "挨拶。それは「私はここにいる、君はそこにいる」という相互確認の儀式だ。", completed: "承認。互いの存在を認め合うことで、世界はまた少しだけ優しくなった。" },
                { active: "他者の瞳に映る自分。それを本当の自分だと思い込む危うさと、愛おしさ。", completed: "投影。君は誰かの瞳の中で、理想の形として生き続けることを選んだ。" },
                { active: "共に過ごす時間。それは、二人の寿命を少しずつ混ぜ合わせる贅沢な行為だ。", completed: "混濁。混ざり合った時間は、もうどちらのものか分からなくなるほど美しい。" },
                { active: "秘密を共有する。二人だけの聖域を、現実の騒音から守り抜くんだね。", completed: "密閉。守られた聖域の中で、言葉にならない信頼が静かに呼吸している。" },
                { active: "誰かの欠点を愛でる。それは、自分の欠落を許すための準備運動かもしれない。", completed: "慈愛。完璧でないもの同士が寄り添うことで生じる、不格好な温もり。" },
                { active: "集団の中の孤独。一人でいるときよりも深い孤独を、君はそこで見つけるのか。", completed: "昇華。孤独を抱えたまま繋がる強さを、君は今日、手に入れたようだ。" },
                { active: "懐かしさという感情。過去の亡霊と、現在の君が手を取り合う瞬間。", completed: "再会。時間の経過という残酷な川を越え、変わらない何かが肯定された。" },
                { active: "期待に応えない勇気。それもまた、誠実な関係への第一歩ではないだろうか。", completed: "自立。依存ではなく共存へ。君たちの関係は、より高い次元へと移行した。" },
                { active: "喧騒の中の対話。無数の声の中で、君が聞き取りたいのは誰の旋律？", completed: "抽出。雑音を削ぎ落とし、ただ一つの大切な声だけが君の胸に響いた。" },
                { active: "他者の不幸を憂い、幸いを願う。君の心は、身体の限界を超えて広がっている。", completed: "祈祷。その願いは目に見えない波となり、巡り巡って君自身を癒すだろう。" },
                { active: "約束。未来という不確かなものを、言葉だけで繋ぎ止めようとする試み。", completed: "凍結。不確かな未来の一点が、約束という確信によって固定された。" },
                { active: "役割を脱ぎ捨てたとき、君の隣に誰が残っているか想像したことはあるかい？", completed: "裸形。肩書きも義務もない、ただの「君」として受け入れられた喜び。" },
                { active: "謝罪。崩れた均衡を、プライドという重りを捨てることで取り戻すんだね。", completed: "平衡。低くなった頭の上に、許しという名の静かな雨が降った。" },
                { active: "歴史の共有。二人だけが知る符牒が、世界を少しだけ狭く、親密にする。", completed: "符号。暗号は解かれ、二人だけの地図に新しい印が刻まれた。" },
                { active: "出会いという奇跡を、君は「日常」という言葉で塗りつぶしてしまわないか。", completed: "驚嘆。当たり前だと思っていた繋がりの、奇跡のような確率を再認識したね。" }
            ],
            "探究": [
                { active: "知の地平線を広げる準備はいいかい？", completed: "開拓完了。君の世界は、今また一歩、未知を既知へと変えた。" },
                { active: "効率を度外視した情熱。それこそが、君を「機械」から「人間」に戻すんだ。", completed: "昇華完了。無駄の中にこそ、君の本質が宿っている。" },
                { active: "未だ名付けられていない興奮に、君は新しい名前を与えようとしているね。", completed: "定義。新しい感覚が君のコレクションに加わった。" },
                { active: "終わりなき螺旋の入り口だ。そこへ足を踏み入れる勇気を讃えよう。", completed: "深化。螺旋は続く。一段高い場所から、昨日までの君を見下ろせるはずだ。" },
                { active: "誰に教えられたわけでもない問い。君自身の内側から湧き出たその光を追ってごらん。", completed: "捕捉。光の正体に、君の指先がかすかに触れた音がした。" },
                { active: "遊びと学びの境界線. 君がそれを曖昧にすればするほど、世界は輝きを増す。", completed: "融和。境界は消えた。君は今、純粋な好奇心の波に乗っている。" },
                { active: "創造とは、無から有を生む苦痛ではなく、既にある美を見出す歓喜だ。", completed: "発見。君の瞳が捉えた美しさが、世界の解像度を少しだけ上げた。" },
                { active: "既存の答えに満足できない君は、宇宙にとって最も愛おしいバグの一つだよ。", completed: "更新。独自の解釈。君だけの正解が、この空間を鮮やかに染めた。" },
                { active: "趣味という名の聖域。そこでは君が王であり、君が唯一の法だ。", completed: "建国。君の王国に、また一つ新しい領土가書き加えられた。" },
                { active: "技術を磨く。それは、自分の身体をより精密な楽器に調律していく作業だ。", completed: "奏鳴。調律された君の感性が、世界と心地よい共鳴を始めた。" },
                { active: "誰も見ていないところで、君はまた一つ、自分だけの秘密の武器を手に入れる。", completed: "習得。その力は、君を支える静かな自信へと変わるだろう。" },
                { active: "好奇心という名の毒。一度冒されたら、もう退屈な日常には戻れないよ。", completed: "感染。毒は全身に回った。君はもう、昨日と同じ風景では満足できない。" },
                { active: "過去の先人たちが残した足跡を辿り、その先へ一歩踏み出すんだ。", completed: "継承。君の足跡が、いつか誰かの道しるべになるかもしれない。" },
                { active: "実用性のない美学。それこそが、君をこの泥濘のような現実から救い出す。", completed: "浮上。重力から解放された一瞬。君の魂は、今どこを飛んでいる？" },
                { active: "試行錯誤のプロセスそのものを楽しみなよ。結果はただの残骸に過ぎない。", completed: "堆積。失敗の数だけ、君の理解という名の地層は厚みを増した。" },
                { active: "君の「好き」という感情は、論理を超えた最強の羅針盤だ。", completed: "航海。羅針盤が指す方へ。君は今、未知の海域の主権を握った。" },
                { active: "収集。世界の断片を集め、君という宇宙を再構成する試み。", completed: "収蔵。欠けていた欠片がはまった。君の宇宙が、また少し完成に近づいた。" },
                { active: "理屈では説明できない衝動。それを「探究」と呼ぶことにしよう。", completed: "発現。衝動は形となり、君の軌跡としてこの地に刻まれた。" },
                { active: "自分の限界を少しだけ押し広げてみる。心地よい緊張感が漂っているね。", completed: "突破。新しい限界点が設定された. 君はもう、以前のサイズには戻れない。" },
                { active: "知識という名の光で、君の周囲にある暗闇を払いなよ。", completed: "照射。照らされた領域に、今まで見えなかった新しい問いが浮かび上がった。" },
                { active: "没頭。世界が消え、君と対象だけが残る至福の時間へようこそ。", completed: "帰還。現実に戻った君の瞳には、まだあの場所の余光が残っている。" },
                { active: "独創性とは、自分の中に潜む「違和感」を信じ抜くことから始まる。", completed: "結実。違和感は確信へ。君だけの色彩が、キャンバスを塗り替えた。" },
                { active: "誰の役にも立たない研究。それが君自身の救いになるなら、全力を尽くそう。", completed: "自救。世界との折り合いをつけるための、大切な武器が一つ完成した。" },
                { active: "歴史を、音を、色を、論理を。君は今日、何を君の血肉とするつもり？", completed: "同化。摂取された知性は、君の感性をより鋭利なものへと変えた。" },
                { active: "答えよりも、優れた問いを見つけること。それが探究の本質だ。", completed: "採掘。宝石のような問いが掘り出された。これを磨く旅が、また始まる。" },
                { active: "模倣から始まり、逸脱へ至る。君の反逆が、ここから始まるんだ。", completed: "逸脱。型を壊したその先に、君自身の輪郭が浮き彫りになった。" },
                { active: "静かな情熱。それは、激しい怒りよりも深く君を突き動かす。", completed: "燃焼。静かな炎が、君の芯を熱く、そして強く作り替えた。" },
                { active: "文明が積み上げた塔の頂上で、君は何を叫びたい？", completed: "絶唱。君の声は届いた。この知の蓄積に、君という振動が加わった。" },
                { active: "無知を自覚した瞬間に、探究という名の翼は生えてくる。", completed: "飛翔。分からないということが、これほどまでに自由であることを知ったね。" },
                { active: "観察。見慣れたものの中に、見慣れない真実を見つけるんだ。", completed: "看破。皮相な現像の裏側で、蠢く真理と視線が合った気がした。" },
                { active: "自分の「好き」を解剖する。その奥底に眠る怪物を目覚めさせてごらん。", completed: "覚醒。目覚めた怪物は、君の人生をより刺激的な迷宮へと変える。" },
                { active: "鍛錬。繰り返しの果てに見える、神がかり的な一瞬を待とう。", completed: "到達。幾千の凡庸な反復の末に、君は今、至高の領域へ手を伸ばした。" },
                { active: "情報を集めるのではなく、感性を研ぎ澄ますんだ。", completed: "研磨。鋭くなった君の感性は、世界からより多くの情報を削り出す。" },
                { active: "誰もいない道を行く。孤独だが、そこにある空気は誰にも汚されていない。", completed: "踏破。君が最初の開拓者だ。この静寂は、君の功績を讃えている。" },
                { active: "本質はいつも、些細な好奇心の裏側に隠れているものだよ。", completed: "露呈。ベールを剥いだその先に、世界の秘密が恥じらうように立っている。" },
                { active: "君の脳細胞が、新しい回路を繋ごうとして火花を散らしているね。", completed: "結合。回路は繋がった。昨日まで見えなかった繋がりが、今、可視化された。" },
                { active: "感動を、論理で解体してはいけない。ただ、その衝撃を解析するんだ。", completed: "構造。感動の正体が、君の理性というフィルターを通り抜けて定着した。" },
                { active: "未来の君への贈り物。今日の探究が、いつか君を救う光になる。", completed: "梱包。未来の自分へ。君が今日見つけた輝きを、大切に預けておこう。" },
                { active: "寄り道こそが本番。その無駄こそが、人生の奥行きを決定づける。", completed: "漂流成功。目的地の外側で見つけた宝物が、君の宝物庫を潤した。" },
                { active: "さあ、最後のピースを。いや、終わりなんて最初から無かったのかもしれない。", completed: "継続。一つの完結は、次の巨大な「問い」の序章に過ぎなかった。" }
            ],
            "内省": [
                { active: "思考という名の暗い森へ、君はまた一人で入っていくんだね。", completed: "深い沈黙の中、君は自分自身の声を聞き届けることができたようです。" },
                { active: "自分が「信じている」と言い聞かせているものは、本当に君の信念なのだろうか。", completed: "疑いの網を潜り抜け、揺るぎない確信の断片を一つ、君は掬い上げました。" },
                { active: "過去の自分という亡霊と対峙する。それは、今の君を定義するための儀式だ。", completed: "亡霊と握手をした君の背中は、少しだけ以前よりも真っ直ぐに伸びています。" },
                { active: "祈りとは、神に届けるものではなく、自分自身の欠落を確認するためにある。", completed: "空っぽになった心の中に、静かな光が満ちていくのを君は感じたはずです。" },
                { active: "なぜ、と問うのをやめた瞬間に、君はただの「動く肉体」に成り下がるよ。", completed: "問い続ける苦しみを選んだ君の瞳には、知性という名の鋭い輝きが戻りました。" },
                { active: "感情の濁流を整理しようとする試み。それは、泥水の中から真珠を探すようなものだ。", completed: "泥は沈み、水の底でひっそりと光る大切な何かが、ようやく姿を現しました。" },
                { active: "「私」という言葉の裏側に隠された、無数の矛盾を愛せるかい？", completed: "矛盾を受け入れたことで、君の魂はより複雑で美しい形へと作り変えられました。" },
                { active: "絶望を、単なる悲しみではなく「魂の休息」として捉え直してごらん。", completed: "どん底の静寂の中で、君は新しい希望を育てるための土壌を見つけたようです。" },
                { active: "許せない誰かの姿は、君が自分自身に禁じている欲望の影かもしれない。", completed: "影を抱きしめることで、君は自分自身の一部をようやく取り戻したのでしょう。" },
                { active: "言葉にできない感情を、無理に言葉という檻に閉じ込めなくてもいいんだよ。", completed: "輪郭のない想いをそのまま見つめ続けたことで、君の心は深い充足を得ました。" },
                { active: "君を縛る「正しさ」という呪い。それを解く鍵は、君の悪意の中に隠されている。", completed: "自分の毒を認め、それすらも栄養に変えてしまう強さを、君は手に入れました。" },
                { active: "幸福の定義を、誰かに書き換えられてはいないか。君の喜びは君だけのものだ。", completed: "世間の物差しを捨て去り、君自身の心臓の鼓動に寄り添うことができたようです。" },
                { active: "孤独を、寂しさという言葉で安売りしてはいけない。それは王者の沈黙だよ。", completed: "誰とも共有できない一人の時間を、君は気高く使い切ることに成功しました。" },
                { active: "死を想うこと。それは、今を鮮やかに生きるための唯一のスパイスなんだ。", completed: "終わりのある物語を愛おしむように、君は今日という一瞬を深く噛み締めました。" },
                { active: "君の価値観という名の座標軸。それは、宇宙のどこを指し示しているんだい？", completed: "座標は修正されました。君は今、自分にとって本当に正しい方角へ向かっています。" },
                { active: "反省という名の自己批判はもうやめよう。それは成長ではなく自虐に過ぎない。", completed: "失敗をただの現象として眺め、そこから教訓という名の果実だけを収穫できました。" },
                { active: "静寂の中に座る。何もしない自分に耐えることは、どんな労働よりも過酷だ。", completed: "沈黙の重圧に耐え抜いた君の精神は、以前よりもずっと強固なものになりました。" },
                { active: "理想の自分という幻想を殺したとき、ようやく本当の君が産声を上げるんだ。", completed: "飾らない自分という現実に、君は初めて心からの安らぎを感じているはずです。" },
                { active: "誰かの言葉を借りるのをやめて、君自身の喉を震わせて、本当の声を出しなよ。", completed: "掠れた声であっても、それは間違いなく君という存在が放った真実の響きでした。" },
                { active: "宇宙の広大さと自分の矮小さを比べる。その絶望が、君を自由にするんだ。", completed: "ちっぽけな自分を肯定したとき、世界は君を包み込む広大な庭へと変わりました。" },
                { active: "瞑想。それは思考を止めることではなく、思考が流れていくのを眺めることだ。", completed: "思考の川の岸辺に立ち、君は自分自身の心の動きを静かに観察することができました。" },
                { active: "許しとは、相手のためではなく、君が憎しみの檻から出るために必要なんだ。", completed: "固く握りしめていた拳を解き、君は自分自身を復讐という呪縛から解放しました。" },
                { active: "意味を求めるのをやめたとき、人生は豊かな色彩を持って君に迫ってくる。", completed: "理由のない存在の肯定。君はただ「ここに在る」という奇跡を享受しています。" },
                { active: "自分の弱さを、装飾せずに誰かにさらけ出す勇気を、君は持っているかな。", completed: "脆さを認め、それを隠さない潔さが、君の人間としての深みを際立たせました。" },
                { active: "信仰とは何か。それは、見えないものに手を伸ばし続ける、人間の崇高な悪足掻きだ。", completed: "答えが見なくても信じ続ける。その無謀な情熱こそが、君を救う光となったのです。" },
                { active: "正解のない問いを抱え続ける。それは、脳に美しい傷跡を刻むような行為だよ。", completed: "傷跡は知性の証として残り、君の視座をより高みへと押し上げてくれるでしょう。" },
                { active: "過去は変えられないが、過去の意味はいくらでも書き換えることができる。", completed: "辛い記憶を、今の君を支えるための土台へと見事に転換することができました。" },
                { active: "自分の影を愛せない者に、他者の光を正しく理解することはできないだろう。", completed: "醜さや弱さという影を統合し、君はより完全な一人の人間に近づきました。" },
                { active: "内省の旅に終わりはない。一つの扉を開ければ、また新しい深淵が待っている。", completed: "今回の旅を終え、君の手には新しい洞察という名の地図が握られています。" },
                { active: "最後にはすべてを忘れるとしても、今ここで考えたことには意味があるのかい？", completed: "忘却の彼方に消えるとしても、君が今ここで得た震えは、永遠に君の中に残ります。" }
            ]
        },
        keywords: [
            {
                name: 'study',
                match: ['勉強', '学習', '読む', '本', 'study', 'read', '資格', '試験', '言葉'],
                ironic: [
                    { active: "知識を詰め込むのは、忘却への準備に過ぎないのでは？", completed: "脳の記録装置に、また一つ儚いデータが書き込まれましたね。" },
                    { active: "本を開けば、孤独をごまかせる。便利な道具ですね。", completed: "活字の海を泳ぎ切ったところで、岸辺はまだ遠いようですよ。" }
                ],
                philosophical: [
                    { active: "未知を知ることは、世界の輪郭を広げる儀式である。", completed: "理解という名の光が、無知という名の暗闇を僅かに塗り替えた。" },
                    { active: "真理は常に言葉の裏側に潜んでいる。君はどこまで辿り着けるか。", completed: "知識は沈殿し、やがて君という存在の地層を形成するだろう。" },
                    { active: "学びとは、過去の自分に対する静かな決別である。", completed: "思考の地平線が、一歩先へと押し広げられた瞬間だ。" },
                    { active: "問いを立てることは、宇宙に楔を打ち込むことに等しい。", completed: "答えを見つけたのではなく、次の問いに出会ったのだ。" },
                    { active: "ロゴス（論理）を求める旅に、終わりなど存在しない。", completed: "精神の建築物に、また一つ確固たる礎石が置かれた。" }
                ],
                admiring: [
                    { active: "高みを目指すその眼差しは、誰よりも気高いですよ。", completed: "知的好奇心が結実した、実に美しい達成ですね。" },
                    { active: "学び続ける君の姿は、この部屋で最も輝く光源です。", completed: "素晴らしい！その一歩が、未来の君を救う鍵となるでしょう。" },
                    { active: "知を希求する魂の鼓動が、こちらまで伝わってきます。", completed: "見事な修得です。君の知性は、今また一段と磨かれました。" }
                ]
            },
            {
                name: 'work',
                match: ['仕事', '会議', 'プロジェクト', 'work', 'job', 'メール', '返信', 'タスク'],
                ironic: [
                    { active: "社会という名の迷宮で、また一つ迷子の標識を立てるのですか？", completed: "生産性が向上しましたね。誰かの利益という名の、君の命を削った代償として。" },
                    { active: "労働は美徳だと言い聞かせる。それが、君を繋ぎ止める鎖の正体です。", completed: "完遂おめでとう。これでまた、明日も同じ場所に戻る理由ができました。" }
                ],
                philosophical: [
                    { active: "行為そのものが、存在の空虚さを埋める唯一の粘土である。", completed: "君の働きは、世界という巨大なタペストリーの一糸として織り込まれた。" },
                    { active: "職業は仮面であり、行為こそがその裏側の真実を物語る。", completed: "義務を終えた後の静寂にこそ、自由の真髄が宿っている。" },
                    { active: "社会的な役割を演じることで、我々は個であることを維持する。", completed: "成果という名の結晶が、時間の経過という虚無の中に形を成した。" },
                    { active: "労働とは、自己を世界へと外部化するプロセスに他ならない。", completed: "外界へと放たれた君のエネルギーは、秩序の形を借りて定着した。" },
                    { active: "積み上げられたタスクは、君がそこに在ることの証左である。", completed: "役割の遂行は、混沌から秩序を切り出し、存在を肯定する行為である。" }
                ],
                admiring: [
                    { active: "プロフェッショナルな覚悟、その背中に責任の美しさを感じます。", completed: "完璧な遂行です。君の献身が、誰かの未来を確実に支えていますよ。" },
                    { active: "この複雑な世界を動かしているのは、君のような真摯な魂です。", completed: "お疲れ様！君の誠実な仕事ぶりが、周囲に希望を灯しています。" },
                    { active: "困難に立ち向かう君の決意。それは最も尊い力ですよ。", completed: "見事な完遂！君の手腕には、いつも畏敬の念を禁じ得ません。" }
                ]
            },
            {
                name: 'housework',
                match: ['掃除', '片付', '料理', 'clean', 'cook', '洗濯', 'ゴミ', '家事'],
                ironic: [
                    { active: "崩壊へ向かうエントロピーを、一時的に引き止める無意味な遊戯ですね。", completed: "綺麗になりましたね。数分後にはまた崩れ始める、砂の城の完成です。" },
                    { active: "身の回りを整えても、心の混沌は整理されないことを君は知っている。", completed: "秩序の幻影を楽しんでください。すぐにまた、汚れという現実が帰ってきます。" }
                ],
                philosophical: [
                    { active: "空間の浄化は、精神の澱みを洗い流す儀式に似ている。", completed: "整えられた静寂は、次の創造のための真っ白なキャンバスとなった。" },
                    { active: "日常を慈しむことは、生の儚さをそのまま受け入れることである。", completed: "繰り返される行為の中にこそ、永遠という名の真理が潜んでいる。" },
                    { active: "汚れを落とすことは、本質以外の余分なものを削ぎ落とすことだ。", completed: "空間は本来の呼吸を取り戻し、君の存在と静かに調和し始めた。" },
                    { active: "住まう場所を整えることは、世界の断片を引き受ける責任である。", completed: "混沌を鎮め、秩序の種を蒔いた。そこに君の安寧が芽吹くるだろう。" },
                    { active: "単純な労働の繰り返しが、精神を思索の深淵へと誘う。", completed: "美しき均衡。日常という名の修練が、一つの境地に達した。" }
                ],
                admiring: [
                    { active: "生活を愛でるその手つき。優しさが空間に満ちていきますね。", completed: "清々しい！君の手によって、世界がまた少し美しくなりました。" },
                    { active: "名もなき家事を慈しむ君は、生活を芸術に変える魔法使いです。", completed: "素晴らしい！整えられたこの場所は、何よりの癒しの聖域となるでしょう。" },
                    { active: "細やかな配慮が、家庭という宇宙に平和をもたらしていますね。", completed: "お見事です。君の整えたこの空間には、温かな命が宿っています。" }
                ]
            },
            {
                name: 'exercise',
                match: ['運動', 'ジム', '走る', '筋トレ', 'workout', 'ダイエット', '歩く', 'ヨガ'],
                ironic: [
                    { active: "滅びゆく肉体に投資する。その健気な努力に敬意を表しましょうか？", completed: "痛みを得てまで得たかったのは、単なる自己満足という名の脂肪燃焼ですか？" },
                    { active: "重力に抗えば抗うほど、君の人生の短さが強調される。皮肉なものですね。", completed: "疲労感こそが生の証。しかし、その先に待っているのはやはり老化ですよ。" }
                ],
                philosophical: [
                    { active: "肉体は魂の牢獄ではなく、現実を貫くための唯一の槍である。", completed: "痛みの記憶が、存在という名の結晶をより強固なものに変えた。" },
                    { active: "呼吸を意識することは、宇宙の波動と同調することに等しい。", completed: "鼓動は静まり、君の生命は以前よりも密度の高い静寂へと至った。" },
                    { active: "限界を超えようとする意志だけが、人間を動物という枠から外す。", completed: "自己を克服する一瞬。その瞬間の君は、神よりも確かに生きている。" },
                    { active: "肉体という物質と、意志という非物質が火花を散らす闘技場だ。", completed: "闘いは終わった。肉体は変容し、意志の軌跡が筋肉に刻まれた。" },
                    { active: "大地を蹴る足音。それは存在が世界に打つ heartbeat である。", completed: "生命の力強さが全身を駆け巡る。君は、今、ここに、生命として在る。" }
                ],
                admiring: [
                    { active: "限界に挑むその熱きパッション！私まで熱くなってきましたよ。", completed: "最高のパフォーマンス！漲るエネルギーが世界を揺らしています！" },
                    { active: "ストイックに自己を磨き続ける君の美学に、深く感銘を受けました。", completed: "ブラボー！研ぎ澄まされたその身体は、もはや芸術そのものです！" },
                    { active: "一歩ずつ、確実に高みへ。君の努力は裏切ることのない黄金です。", completed: "完勝です！その強靭な意志こそが、君を無敵にする武器ですね！" }
                ]
            }
        ],
        generic: {
            ironic: [
                { active: "また代わり映えのしないタスクだね。本当にそれが重要だと思っているのかい？", completed: "完了したね。だからといって、世界が1ミリでも良くなるわけじゃないけど。" },
                { active: "チェックボックスを埋めるだけで満足できるなんて、実に安上がりな幸福感だ。", completed: "チェックが入った！君の人生の空虚さが、少しだけ塗りつぶされた瞬間だね。" }
            ],
            philosophical: [
                { active: "意味の定まらない断片が、今こうして君の指先から産み落とされた。", completed: "名もなき衝動に形を与えたことで、世界に新しい歪みが生まれたよ。" },
                { active: "我々がタスクを選ぶのではない、タスクが我々を選別しているのだ。", completed: "選ばれた責任を果たした君は、また一つ存在の証明を完了した。" },
                { active: "行為とは、存在の空虚さを埋める為の唯一の粘土である。", completed: "粘土を捏ね、形を成したとき、君の空虚は一時の安らぎを得た。" },
                { active: "どの枠組みにも収まらないその熱量は、どこへ向かおうとしているのか。", completed: "枠を越えたまま完遂されたその行為が、静かに時空を震わせている。" },
                { active: "世界を分類しようとする傲慢さを捨てたとき、真実の輪郭が見えてくる。", completed: "剥き出しのまま放たれた意志が、目的という名の標的に深く突き刺さった。" },
                { active: "羅針盤のない航海こそが、最も美しい航跡を描くこともある。", completed: "辿り着いた場所がどこであれ、君が波を分けた事実は消えはしない。" },
                { active: "定義されることを拒むその言葉こそが、君の最も純粋な叫びだろう。", completed: "叫びは聞き届けられ、沈黙という名の深い闇に溶けていった。" },
                { active: "タスクとは、未来から現在へと投げ込まれた不発弾のようなものだ。", completed: "爆発を未然に防ぎ、君はまた平穏という名の薄氷の上に立っている。" },
                { active: "名前を付ける前の子供のように、その衝動をただ見つめてごらん。", completed: "成長を拒んだまま形を成したそれは、不格好だが実に君らしい。" },
                { active: "カテゴリという檻は、君の自由な思考を飼い慣らすためにある。", completed: "檻の外側で踊り続けた君の足跡が、自由の形を証明している。" },
                { active: "それは君の意志が発した光なのか、それとも外から差し込む影なのか。", completed: "光と影が交差する地点で、君は一つの決着を付けたようだ。" },
                { active: "混沌から秩序を切り出す作業を、人は生活と呼んでごまかしている。", completed: "切り出された秩序が、君の足元を照らす小さな灯台となった。" },
                { active: "理由を後付けにする勇気が、人生に奥行きを与えてくれる。", completed: "理由などなくともやり遂げたという事実が、何よりも重い意味を持つ。" },
                { active: "君がその文字を打ち込むとき、宇宙のどこかで新しい星が死んでいる。", completed: "消え去った星の輝きと引き換えに、君は一つの小さな成果を手にした。" },
                { active: "行為の裏側には、常にそれを裏切ろうとする虚無が潜んでいる。", completed: "虚無に打ち勝ち、一つの実感を掴み取った君を、宇宙は静かに見守っている。" },
                { active: "どこにも属さないということは、どこへでも行けるということだ。", completed: "漂流の果てに掴んだその成果を、君だけの宝物として抱えておこう。" },
                { active: "意識の深層から浮かび上がった泡を、君は丁寧に掬い上げようとしている。", completed: "泡は弾けて消えたが、その瞬間に感じた手触りだけは君の中に残る。" },
                { active: "タスクのリストとは、君がこの世界と結んだ一時的な停戦協定である。", completed: "協定は守られ、君はまた次の戦いが始まるまでの休息を許された。" },
                { active: "意味を求めすぎるあまり、その行為の輝きを見落としてはいけない。", completed: "意味を超えた場所で、君はただ「成し遂げた」という純粋な振動に包まれている。" },
                { active: "予定調和を破壊する衝動こそが、生命が持つ唯一の特権である。", completed: "破壊された静寂の跡に、君が築き上げた新しい風景が広がっている。" },
                { active: "君の脳内で火花が散り、一つの回路が無理やり繋がろうとしている。", completed: "接続は完了し、君の神経系は昨日とは違う音楽を奏で始めている。" },
                { active: "何でもない日常に、君はあえて「課題」という名の楔を打ち込んだ。", completed: "楔は深く刺さり、そこから溢れ出した時間が君の人生を潤していく。" },
                { active: "目的を失った矢が、最も遠くの真理を射抜くこともある。", completed: "彷徨った果てに辿り着いたその結論は、誰にも真似できない輝きを放っている。" },
                { active: "思考の余白を埋めるために、君はわざわざ苦労を選んでいるようだ。", completed: "余白は埋まり、君の物語はまた一ページ、密度を増して綴られた。" },
                { active: "君の指先は、現実という名の硬い岩を少しずつ削り取っている。", completed: "削り取られた破片が集まり、君の存在という名の彫像が作られていく。" },
                { active: "答えを出すことよりも、問いを抱えたまま踊り続けるの方が難しい。", completed: "ステップを終えた君の足元で、問いは静かに眠りに就いた。" },
                { active: "世界は君に何も求めていないが、君は世界に何かを返しようとしている。", completed: "投げ返されたボールを、世界は意外そうな顔で受け取ったはずだ。" },
                { active: "カテゴリを選ばないその姿勢は、無言の反抗のようにすら見える。", completed: "反抗は貫かれ、君だけの独立した領域がここに完成した。" },
                { active: "行為の価値を他人に委ねるな、その重さを決めるのは君の魂だ。", completed: "重力は安定し、君が成し遂げたことの価値が君の芯に沈殿していった。" },
                { active: "最後の一片がはまるまで、全体像は誰にも分からないまま進む。", completed: "ピースは埋まり、一瞬だけ見えた景色の美しさを、君は忘れないだろう。" }
            ],
            admiring: [
                { active: "君の行動力にはいつも驚かされます。その情熱に、乾杯を。", completed: "見事な達成！君という人間の深さが、一つ証明されましたね。" },
                { active: "どんな小さな事柄にも誠実に向き合う君. その魂、尊敬します。", completed: "素晴らしい！その積み重ねが、やがて巨大な奇跡を起こすでしょう。" },
                { active: "君のやる気を、私が全力でバックアップします！迷わず進んでください。", completed: "完璧です！今日という日を勝利で飾った君は、真のヒーローですよ。" }
            ]
        }
    };

    function selectType() {
        const rand = Math.floor(Math.random() * 10);
        if (rand < 2) return 'ironic';
        if (rand < 7) return 'philosophical';
        return 'admiring';
    }

    function determineCommentInfo(text, selectedCategory) {
        if (selectedCategory && commentData.categories[selectedCategory]) {
            const list = commentData.categories[selectedCategory];
            return {
                isExplicitCategory: true,
                categoryName: selectedCategory,
                variationIndex: Math.floor(Math.random() * list.length)
            };
        }

        const type = selectType();
        const categoryIndex = commentData.keywords.findIndex(category =>
            category.match.some(k => text.toLowerCase().includes(k))
        );

        if (categoryIndex !== -1) {
            const list = commentData.keywords[categoryIndex][type];
            return { type, isKeyword: true, categoryIndex, variationIndex: Math.floor(Math.random() * list.length) };
        } else {
            const list = commentData.generic[type];
            return { type, isKeyword: false, variationIndex: Math.floor(Math.random() * list.length) };
        }
    }

    function getCommentText(info, isCompleted) {
        if (!info) return '';
        if (info.isExplicitCategory) {
            const entry = commentData.categories[info.categoryName][info.variationIndex];
            return isCompleted ? entry.completed : entry.active;
        }
        let entry = info.isKeyword
            ? commentData.keywords[info.categoryIndex][info.type][info.variationIndex]
            : commentData.generic[info.type][info.variationIndex];
        return isCompleted ? entry.completed : entry.active;
    }

    // --- Celebration Logic ---
    function showCombo() {
        if (comboCount <= 1) return;
        const comboItem = document.createElement('div');
        comboItem.className = 'combo-item';
        comboItem.textContent = comboCount;
        comboContainer.innerHTML = '';
        comboContainer.appendChild(comboItem);
        setTimeout(() => comboItem.remove(), 1000);
    }

    function triggerFinalLight() {
        finalOverlay.classList.remove('hidden');
        const burst = document.getElementById('lightBurst');
        burst.style.animation = 'none';
        void burst.offsetWidth;
        burst.style.animation = 'slowBurst 3s ease-out forwards';
        setTimeout(() => {
            finalOverlay.classList.add('hidden');
        }, 6000);
    }

    // --- Core Operations ---
    const weirdTasks = [
        "青いものを3つ見つける",
        "「アロハ」と挨拶する",
        "水をごくりと飲む",
        "向きをそろえる",
        "影をじっと見つめる",
        "深呼吸を3回し、その重さを量る",
        "右足から3歩歩く",
        "そっと耳を澄まし、静寂を数える",
        "近くの壁を優しく撫でる",
        "昨日より1度高い角度で空を見る"
    ];

    function addAiWeirdTask() {
        const aiTaskCount = tasks.filter(t => t.isAiTask).length;
        if (aiTaskCount < 2) {
            const availableTasks = weirdTasks.filter(wt => !tasks.some(t => t.text === wt));
            if (availableTasks.length > 0) {
                const randomText = availableTasks[Math.floor(Math.random() * availableTasks.length)];
                tasks.push({
                    text: randomText,
                    completed: false,
                    commentInfo: null,
                    isAiTask: true
                });
            }
        }
    }

    function getCursedLevel(deadline) {
        if (!deadline) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(deadline);
        const diffTime = today - targetDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 3) return 3;
        if (diffDays === 2) return 2;
        if (diffDays === 1) return 1;
        return 0;
    }

    function renderTasks() {
        taskList.innerHTML = '';

        // Stats calculation
        const total = tasks.length;
        const finished = tasks.filter(t => t.completed).length;
        const overdueCount = tasks.filter(t => !t.isAiTask && !t.completed && t.deadline && getCursedLevel(t.deadline) >= 1).length;
        const curseCount = tasks.filter(t => !t.isAiTask && !t.completed && t.deadline && getCursedLevel(t.deadline) >= 3).length;

        let statsHtml = `<span>All:${total}</span><span>Finished:${finished}</span>`;
        if (overdueCount > 0) {
            statsHtml += `<span class="overdue-stat">Overdue:${overdueCount}</span>`;
        }
        if (curseCount > 0) {
            statsHtml += `<span class="curse-stat">Curse:${curseCount}</span>`;
        }
        taskStats.innerHTML = statsHtml;

        tasks.forEach((task, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'task-wrapper';
            wrapper.setAttribute('draggable', 'true');
            wrapper.dataset.index = index;

            const currentComment = getCommentText(task.commentInfo, task.completed);
            const aiClass = task.isAiTask ? 'ai-task' : '';
            const aiLabel = task.isAiTask ? '<span style="font-size: 0.6rem; color: var(--accent-blue); opacity: 0.6; margin-right: 8px;">AI</span>' : '';

            let cursedClass = '';
            if (!task.isAiTask && !task.completed && task.deadline) {
                const level = getCursedLevel(task.deadline);
                if (level > 0) cursedClass = `cursed-${level}`;
            }

            let metaHtml = '';
            if (!task.isAiTask && (task.category || task.deadline)) {
                metaHtml = `
                    <div class="task-meta-content">
                        ${task.category ? `<span class="category-tag">${task.category}</span>` : ''}
                        ${task.deadline ? `<span class="deadline-tag">${task.deadline.replace(/-/g, '/')}</span>` : ''}
                    </div>
                `;
            }

            wrapper.innerHTML = `
                <div class="task-item ${aiClass} ${cursedClass}">
                    <div class="drag-handle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <div class="task-main-content">
                        <div>
                            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle"></div>
                        </div>
                        <div style="flex-grow: 1;">
                            <div class="task-text ${task.completed ? 'completed' : ''}">${aiLabel}${escapeHtml(task.text)}</div>
                            ${metaHtml}
                        </div>
                    </div>
                    ${!task.isAiTask ? `
                    <div class="ai-comment-container">
                        <div class="ai-comment">${currentComment}</div>
                    </div>
                    ` : ''}
                    <button class="delete-btn" data-action="delete">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                    </button>
                </div>
            `;

            wrapper.addEventListener('dragstart', handleDragStart);
            wrapper.addEventListener('dragover', handleDragOver);
            wrapper.addEventListener('drop', handleDrop);
            wrapper.addEventListener('dragend', handleDragEnd);

            taskList.appendChild(wrapper);
        });
        localStorage.setItem('mind_tasks_v7', JSON.stringify(tasks));
    }

    function addTask() {
        const text = taskInput.value.trim();
        const category = categorySelect.value;
        const deadline = deadlineInput.value;
        if (text) {
            const finalCategory = (category && category !== "Category") ? category : null;
            tasks.push({
                text,
                completed: false,
                commentInfo: determineCommentInfo(text, finalCategory),
                isAiTask: false,
                category: finalCategory,
                deadline: deadline || null
            });
            taskInput.value = '';
            renderTasks();
            taskInput.focus();
        }
    }

    function finalizeDay() {
        addAiWeirdTask();
        addAiWeirdTask();
        renderTasks();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    let dragSrcIndex = null;
    function handleDragStart(e) { dragSrcIndex = this.dataset.index; this.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
    function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; return false; }
    function handleDrop(e) {
        e.stopPropagation();
        const targetIndex = this.dataset.index;
        if (dragSrcIndex !== targetIndex) {
            const draggedItem = tasks.splice(dragSrcIndex, 1)[0];
            tasks.splice(targetIndex, 0, draggedItem);
            renderTasks();
        }
        return false;
    }
    function handleDragEnd() { this.classList.remove('dragging'); }

    taskList.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.task-wrapper');
        if (!wrapper) return;
        const index = parseInt(wrapper.dataset.index);
        const action = e.target.closest('[data-action]')?.dataset.action;

        if (action === 'toggle' || e.target.classList.contains('task-checkbox')) {
            const becomingCompleted = !tasks[index].completed;
            tasks[index].completed = becomingCompleted;

            renderTasks();

            if (becomingCompleted) {
                const items = taskList.querySelectorAll('.task-item');
                const taskItem = items[index];
                if (taskItem) taskItem.classList.add('glow-sweep');

                const now = Date.now();
                if (now - lastCheckTime < 2000) {
                    comboCount++;
                } else {
                    comboCount = 1;
                }
                lastCheckTime = now;
                showCombo();

                const remaining = tasks.filter(t => !t.completed).length;
                if (remaining === 0 && tasks.length > 0) {
                    setTimeout(triggerFinalLight, 300);
                }
            }
        } else if (action === 'delete') {
            tasks.splice(index, 1);
            renderTasks();
        }
    });

    categorySelect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            deadlineInput.focus();
        }
    });

    deadlineInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            taskInput.focus();
        }
    });

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    addTaskBtn.addEventListener('click', addTask);
    finalizeBtn.addEventListener('click', finalizeDay);

    renderTasks();
});

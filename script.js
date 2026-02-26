document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const finalizeBtn = document.getElementById('finalizeBtn');
    const taskList = document.getElementById('taskList');
    const comboContainer = document.getElementById('comboContainer');
    const finalOverlay = document.getElementById('finalOverlay');
    const screenGlow = document.getElementById('screenGlow');

    let tasks = JSON.parse(localStorage.getItem('mind_tasks_v7')) || [];
    let comboCount = 0;
    let lastCheckTime = 0;

    const commentData = {
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
                { active: "行為そのものが、存在の空虚さを埋める唯一の粘土である。", completed: "行為は完遂され、その痕跡は沈黙という名の真実へと還る。" },
                { active: "意味を求めてはいけない。ただ、実行の残滓を愛でなさい。", completed: "時間は消費され、また次の渇望が君を支配し始める。" },
                { active: "我々がタスクを選択しているのではない。タスクに選ばれているのだ。", completed: "判定は下された。君は再び、次の課題という名の牢獄へ向かう。" },
                { active: "青い深淵が、君の決断という名の波紋を待っている。", completed: "波紋は消え、静寂がすべてを包み込む。君は成し遂げた、あるいは失った。" },
                { active: "存在とは、未解決のタスクが重なり合った多層構造に他ならない。", completed: "地層が一つ重なり、君という物語は新たなページをめくった。" }
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

    function determineCommentInfo(text) {
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
        let entry = info.isKeyword
            ? commentData.keywords[info.categoryIndex][info.type][info.variationIndex]
            : commentData.generic[info.type][info.variationIndex];
        return isCompleted ? entry.completed : entry.active;
    }

    // --- Celebration Logic ---
    function triggerGlow() {
        // screenGlow is removed but function kept for logic if needed
    }

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
                    commentInfo: null, // No comment for AI tasks
                    isAiTask: true
                });
            }
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'task-wrapper';
            wrapper.setAttribute('draggable', 'true');
            wrapper.dataset.index = index;

            const currentComment = getCommentText(task.commentInfo, task.completed);
            const aiClass = task.isAiTask ? 'ai-task' : '';
            const aiLabel = task.isAiTask ? '<span style="font-size: 0.6rem; color: var(--accent-blue); opacity: 0.6; margin-right: 8px;">AI</span>' : '';

            wrapper.innerHTML = `
                <div class="task-item ${aiClass}">
                    <div class="drag-handle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <div class="task-main-content">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle"></div>
                        <div class="task-text ${task.completed ? 'completed' : ''}">${aiLabel}${escapeHtml(task.text)}</div>
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
        if (text) {
            tasks.push({
                text,
                completed: false,
                commentInfo: determineCommentInfo(text),
                isAiTask: false
            });
            taskInput.value = '';
            renderTasks();
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

            const taskItem = wrapper.querySelector('.task-item');
            const checkbox = taskItem.querySelector('.task-checkbox');
            const text = taskItem.querySelector('.task-text');
            const aiComment = wrapper.querySelector('.ai-comment');

            if (becomingCompleted) {
                checkbox.classList.add('checked');
                text.classList.add('completed');
                taskItem.classList.remove('glow-sweep');
                void taskItem.offsetWidth;
                taskItem.classList.add('glow-sweep');

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
            } else {
                checkbox.classList.remove('checked');
                text.classList.remove('completed');
                taskItem.classList.remove('glow-sweep');
            }

            if (aiComment) {
                aiComment.textContent = getCommentText(tasks[index].commentInfo, tasks[index].completed);
            }

            localStorage.setItem('mind_tasks_v7', JSON.stringify(tasks));
        } else if (action === 'delete') {
            tasks.splice(index, 1);
            renderTasks();
        }
    });

    addTaskBtn.addEventListener('click', addTask);
    finalizeBtn.addEventListener('click', finalizeDay);
    taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

    renderTasks();
});

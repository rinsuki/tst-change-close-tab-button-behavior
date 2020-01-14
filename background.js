const TST_ID="treestyletab@piro.sakura.ne.jp"

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

async function submitToTST() {
    var retryCount = 0
    while (retryCount < 5) {
        console.log("trying to submit addon information to TST...", retryCount)
        await sleep(1000 * retryCount)
        try {
            await browser.runtime.sendMessage(TST_ID, {
                type: "register-self",
                name: browser.runtime.getManifest().name,
                icons: browser.runtime.getManifest().icons,
                listeningTypes: ["tab-clicked"]
            })
            console.log(["successful submit to TST"])
            break
        } catch(e) {
            console.error(["Failed to connect with TST", e])
        }
        retryCount++
    }
}

async function main() {
    await submitToTST()
    browser.runtime.onMessageExternal.addListener(async (message, sender) => {
        if (sender.id !== TST_ID) return
        console.log(message)
        switch (message.type) {
        case "tab-clicked":
            if (message.closebox !== true) return
            if (message.button !== 1) return
            let tabIds = [message.tab.id]
            // すべての子孫タブを閉じる
            function loop(childrens) {
                for (const childTab of childrens) {
                    tabIds.push(childTab.id)
                    loop(childTab.children)
                }
            }
            loop(message.tab.children)
            await browser.tabs.remove(tabIds)
            return true
        case "ready":
            await submitToTST()
            break
        }
    })
}
main()
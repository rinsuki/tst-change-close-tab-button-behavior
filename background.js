const TST_ID="treestyletab@piro.sakura.ne.jp"

async function main() {
    browser.runtime.onMessageExternal.addListener(async (message, sender) => {
        if (sender.id !== TST_ID) return
        console.log(message)
        if (message.type !== "tab-clicked") return
        if (message.closebox !== true) return
        let tabIds = [message.tab.id]
        if (message.button === 1) {
            // すべての子孫タブを閉じる
            function loop(childrens) {
                for (const childTab of childrens) {
                    tabIds.push(childTab.id)
                    loop(childTab.children)
                }
            }
            loop(message.tab.children)
        }
        await browser.tabs.remove(tabIds)
        return true
    })
    const success = await browser.runtime.sendMessage(TST_ID, {
        type: "register-self",
        name: browser.runtime.getManifest().name,
        icons: browser.runtime.getManifest().icons,
        listeningTypes: ["tab-clicked"]
    })
}
main()
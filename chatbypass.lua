--[[

      // reset topic script / AnthonyIsntHere
      // thank you to mr vadrift for this
      // thanks voidfunction and fizi for the method
      // more methods soon

      [+] 07/20: Released.

                                                          ]]--


repeat task.wait() until game:IsLoaded()
local chatService, players = game:GetService("Chat"), game:GetService("Players")

local custom_chars = {
    ["e"] = "е",
    ["i"] = "і",
    ["c"] = "с",
    ["o"] = "о",
    ["p"] = "р",
    ["s"] = "ѕ",
    ["u"] = "υ"
}
local default = " 𐌜⬜⬜⬜⬜̌ ◻ 𐌖 𐌖𐌖𐌖 ॓॓॓###########॓॓॓𐌖𐌖 𐌖￭𐌖𐌖 ̌ ̌𐌖  𐌜⬜𐌜⬜ 𐌖 𐌜⬜⬜⬜॓॓॓i 𐌜⬜⬜ ť"

local player = players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local chatGui, chatBar = playerGui:WaitForChild("Chat")

repeat task.wait() until chatGui:FindFirstChild("ChatBar", true)
chatBar = chatGui:FindFirstChild("ChatBar", true)

do
    local randomstr = function()
        local characters = {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}
        local str = ""
        local length = math.random(12, 32)
    
        for i = 1, length do
            str = str .. characters[math.random(#characters)]
        end
        return str
    end
    task.spawn(function()
        while wait(.1) do
            if chatBar:IsFocused() then
                chatService:FilterStringForBroadcast(randomstr(), player)
            end
        end
    end)
end

local old
old = hookmetamethod(game, "__namecall", newcclosure(function(self, ...)
    local method = getnamecallmethod()
    local args = {...}

    if method == "FireServer" and self.Name == "SayMessageRequest" and #args == 2 then
        local newMessage = args[1]
        for i,v in pairs(custom_chars) do
            local rep = string.gsub(newMessage, i, v)
            newMessage = rep --im too lazy to deal with 2vars being released back to me
        end
        newMessage = default .. newMessage

        args[1] = newMessage
        return old(self, unpack(args))
    end
    return old(self, ...)
end))

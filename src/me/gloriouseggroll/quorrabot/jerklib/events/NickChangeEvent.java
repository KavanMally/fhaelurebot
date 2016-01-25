/* 
 * Copyright (C) 2015 www.quorrabot.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package me.gloriouseggroll.quorrabot.jerklib.events;

import me.gloriouseggroll.quorrabot.jerklib.Session;

/**
 * NickChangeIRCEvent is created when someone in a channel changes their nick
 *
 * @author mohadib
 */
public class NickChangeEvent extends IRCEvent
{

    private final String oldNick, newNick;

    public NickChangeEvent(
            String rawEventData,
            Session session,
            String oldNick,
            String newNick)
    {
        super(rawEventData, session, Type.NICK_CHANGE);
        this.oldNick = oldNick;
        this.newNick = newNick;
    }

    /**
     * Returns the previous nick of the user before the change
     *
     * @return Old nick for user.
     */
    public final String getOldNick()
    {
        return oldNick;
    }

    /**
     * getNewNick() returns the new nick of the user
     *
     * @return New nick for user
     */
    public final String getNewNick()
    {
        return newNick;
    }
}

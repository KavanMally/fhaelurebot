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
package me.gloriouseggroll.quorrabot.jerklib.parsers;

import me.gloriouseggroll.quorrabot.jerklib.events.IRCEvent;
import me.gloriouseggroll.quorrabot.jerklib.events.WhowasEvent;

public class WhoWasParser implements CommandParser
{

    /*
     * :kubrick.freenode.net 314 scripy1 ty n=ty 71.237.206.180 * :ty "<nick>
     * <user> <host> * :<real name>"
     */
    @Override
    public IRCEvent createEvent(IRCEvent event)
    {
        return new WhowasEvent(
                event.arg(3),
                event.arg(2),
                event.arg(1),
                event.arg(5),
                event.getRawEventData(),
                event.getSession());
    }
}

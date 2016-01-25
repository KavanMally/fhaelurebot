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
package me.gloriouseggroll.quorrabot.event;

import com.google.common.eventbus.SubscriberExceptionContext;
import com.google.common.eventbus.SubscriberExceptionHandler;

public class ExceptionHandler implements SubscriberExceptionHandler
{

    @Override
    public void handleException(Throwable thrwbl, SubscriberExceptionContext sec)
    {
        com.gmt2001.Console.err.println("Failed to dispatch event " + sec.getEvent().toString() + " to " + sec.getSubscriberMethod().toString());
        com.gmt2001.Console.err.printStackTrace(thrwbl);
    }
}

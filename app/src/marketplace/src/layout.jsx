// @flow

import React from 'react'
import { NavLogo, NavLink } from 'streamr-layout/dist/bundle'
import Link from './components/Link/index'

import links from './links'

NavLogo.Link = <Link href={links.streamrSite} />
NavLink.Link = <Link>Anything.</Link>

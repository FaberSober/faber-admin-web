package com.faber.common.util;

import org.junit.jupiter.api.Test;

public class IpUtilsTest {

    @Test
    public void testGetIpAddrByApi() {
        System.out.println(IpUtils.getIpAddrByApi("221.231.195.147"));
    }

}

package no.borber.monsterShop.readLayer.basket;

import java.util.Collection;

public interface Baskets {
    Collection<BasketLineItemInfo> getBasketLineItems(String basketId);
}

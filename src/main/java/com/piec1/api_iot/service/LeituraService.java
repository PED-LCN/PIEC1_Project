package com.piec1.api_iot.service;

import com.piec1.api_iot.dto.LeituraRequestDTO;
import com.piec1.api_iot.dto.LeituraResponseDTO;
import com.piec1.api_iot.models.Leitura;
import com.piec1.api_iot.models.Produto;
import com.piec1.api_iot.repositories.LeituraRepository;
import com.piec1.api_iot.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeituraService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private LeituraRepository leituraRepository;

    public LeituraResponseDTO registrarLeitura(LeituraRequestDTO dto) {
        Optional<Produto> produtoExistente = produtoRepository.findById(dto.produtoId());

        if (produtoExistente.isEmpty()) {
            throw new IllegalArgumentException("Produto com ID: " + dto.produtoId() + " inexistente no sistema.");
        }

        Leitura novaLeitura = new Leitura();
        novaLeitura.setValorLeitura(dto.valorLeitura());
        novaLeitura.setProduto(produtoExistente.get());

        Leitura leituraSalva = leituraRepository.save(novaLeitura);

        return new LeituraResponseDTO(
                leituraSalva.getId(),
                leituraSalva.getValorLeitura(),
                leituraSalva.getDataHora(),
                leituraSalva.getProduto().getNome()
        );
    }

    public List<LeituraResponseDTO> listarTodas() {
        return leituraRepository.findAll().stream().
                map(l -> new LeituraResponseDTO(
                        l.getId(), l.getValorLeitura(),
                        l.getDataHora(),
                        l.getProduto().getNome())).
                collect(Collectors.toList());
    }
}
